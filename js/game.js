(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");
  const scoreEl = document.getElementById("score");
  const bestEl = document.getElementById("best");
  const livesEl = document.getElementById("lives");
  const overlay = document.getElementById("overlay");
  const overlayTitle = document.getElementById("overlay-title");
  const overlayCopy = document.getElementById("overlay-copy");
  const primaryBtn = document.getElementById("primary-btn");

  const W = 480;
  const H = 640;
  const BEST_KEY = "neon-catch-best";

  const state = {
    running: false,
    score: 0,
    best: Number(localStorage.getItem(BEST_KEY) || 0),
    lives: 3,
    time: 0,
    spawnTimer: 0,
    orbs: [],
    particles: [],
    keys: { left: false, right: false },
    pointerX: null,
    pointerActive: false,
  };

  const paddle = {
    w: 92,
    h: 16,
    x: W / 2 - 46,
    y: H - 48,
    speed: 420,
  };

  function setupCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  bestEl.textContent = String(state.best);
  setupCanvas();

  function setPlayingUi(isPlaying) {
    document.body.classList.toggle("is-playing", isPlaying);
  }

  function resetGame() {
    state.score = 0;
    state.lives = 3;
    state.time = 0;
    state.spawnTimer = 0;
    state.orbs = [];
    state.particles = [];
    paddle.x = W / 2 - paddle.w / 2;
    updateHud();
  }

  function updateHud() {
    scoreEl.textContent = String(state.score);
    bestEl.textContent = String(state.best);
    livesEl.textContent = "●".repeat(state.lives) + "○".repeat(Math.max(0, 3 - state.lives));
  }

  function showOverlay(screen, title, copy, buttonLabel) {
    overlay.hidden = false;
    overlay.dataset.screen = screen;
    overlayTitle.textContent = title;
    overlayCopy.textContent = copy;
    primaryBtn.textContent = buttonLabel;
  }

  function hideOverlay() {
    overlay.hidden = true;
  }

  function startGame() {
    resetGame();
    state.running = true;
    setPlayingUi(true);
    hideOverlay();
  }

  function endGame() {
    state.running = false;
    state.pointerActive = false;
    state.pointerX = null;
    setPlayingUi(false);
    if (state.score > state.best) {
      state.best = state.score;
      localStorage.setItem(BEST_KEY, String(state.best));
    }
    updateHud();
    showOverlay(
      "gameover",
      "Game Over",
      `You scored ${state.score}. ${state.score >= state.best ? "New personal best!" : "Catch more orbs next run."}`,
      "Play Again"
    );
  }

  function spawnOrb() {
    const dangerChance = Math.min(0.18 + state.time * 0.008, 0.42);
    const isDanger = Math.random() < dangerChance;
    const radius = isDanger ? 12 + Math.random() * 6 : 10 + Math.random() * 8;
    state.orbs.push({
      x: radius + Math.random() * (W - radius * 2),
      y: -radius,
      r: radius,
      vy: 140 + Math.random() * 80 + state.time * 6,
      danger: isDanger,
      hue: isDanger ? 350 : 168 + Math.random() * 40,
    });
  }

  function burst(x, y, color, count = 10) {
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
      const speed = 40 + Math.random() * 120;
      state.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.35 + Math.random() * 0.35,
        color,
      });
    }
  }

  function update(dt) {
    if (!state.running) return;

    state.time += dt;
    state.spawnTimer -= dt;

    if (state.spawnTimer <= 0) {
      spawnOrb();
      const interval = Math.max(0.35, 1.05 - state.time * 0.02);
      state.spawnTimer = interval;
    }

    let move = 0;
    if (state.keys.left) move -= 1;
    if (state.keys.right) move += 1;
    paddle.x += move * paddle.speed * dt;

    if (state.pointerX !== null) {
      paddle.x += (state.pointerX - paddle.w / 2 - paddle.x) * Math.min(1, dt * 14);
    }

    paddle.x = Math.max(8, Math.min(W - paddle.w - 8, paddle.x));

    for (let i = state.orbs.length - 1; i >= 0; i -= 1) {
      const orb = state.orbs[i];
      orb.y += orb.vy * dt;

      const withinX = orb.x + orb.r > paddle.x && orb.x - orb.r < paddle.x + paddle.w;
      const hitPaddle = withinX && orb.y + orb.r >= paddle.y && orb.y - orb.r <= paddle.y + paddle.h;

      if (hitPaddle) {
        if (orb.danger) {
          state.lives -= 1;
          burst(orb.x, orb.y, "rgba(255,77,109,0.9)", 14);
          updateHud();
          if (state.lives <= 0) {
            endGame();
            return;
          }
        } else {
          state.score += 10;
          burst(orb.x, orb.y, "rgba(182,255,74,0.95)", 12);
          updateHud();
        }
        state.orbs.splice(i, 1);
        continue;
      }

      if (orb.y - orb.r > H) {
        if (!orb.danger) {
          state.lives -= 1;
          updateHud();
          if (state.lives <= 0) {
            endGame();
            return;
          }
        }
        state.orbs.splice(i, 1);
      }
    }

    for (let i = state.particles.length - 1; i >= 0; i -= 1) {
      const p = state.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 180 * dt;
      if (p.life <= 0) state.particles.splice(i, 1);
    }
  }

  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#07131c");
    g.addColorStop(1, "#03080e");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.18;
    for (let y = 40; y < H; y += 40) {
      ctx.strokeStyle = "#2ee6d6";
      ctx.beginPath();
      ctx.moveTo(0, y + ((state.time * 20) % 40));
      ctx.lineTo(W, y + ((state.time * 20) % 40));
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPaddle() {
    const grad = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.w, paddle.y);
    grad.addColorStop(0, "#2ee6d6");
    grad.addColorStop(0.5, "#b6ff4a");
    grad.addColorStop(1, "#2ee6d6");

    ctx.shadowColor = "rgba(46,230,214,0.55)";
    ctx.shadowBlur = 18;
    ctx.fillStyle = grad;
    roundRect(paddle.x, paddle.y, paddle.w, paddle.h, 8);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawOrbs() {
    for (const orb of state.orbs) {
      ctx.save();
      ctx.shadowColor = orb.danger ? "rgba(255,77,109,0.75)" : "rgba(46,230,214,0.7)";
      ctx.shadowBlur = 16;
      const grad = ctx.createRadialGradient(orb.x - 3, orb.y - 3, 2, orb.x, orb.y, orb.r);
      if (orb.danger) {
        grad.addColorStop(0, "#ffb3c1");
        grad.addColorStop(1, "#ff4d6d");
      } else {
        grad.addColorStop(0, "#effff8");
        grad.addColorStop(1, `hsl(${orb.hue} 90% 55%)`);
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function drawParticles() {
    for (const p of state.particles) {
      ctx.globalAlpha = Math.max(0, p.life * 2);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function draw() {
    drawBackground();
    drawOrbs();
    drawParticles();
    drawPaddle();
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.033, (now - last) / 1000);
    last = now;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  function clientXFromEvent(event) {
    if (typeof event.clientX === "number") return event.clientX;
    if (event.touches && event.touches[0]) return event.touches[0].clientX;
    if (event.changedTouches && event.changedTouches[0]) return event.changedTouches[0].clientX;
    return null;
  }

  function setPointerFromEvent(event) {
    const clientX = clientXFromEvent(event);
    if (clientX === null) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0) return;
    const scaleX = W / rect.width;
    state.pointerX = (clientX - rect.left) * scaleX;
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") state.keys.left = true;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") state.keys.right = true;
    if ((e.key === "Enter" || e.key === " ") && !state.running) {
      e.preventDefault();
      startGame();
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") state.keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") state.keys.right = false;
  });

  canvas.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    state.pointerActive = true;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (_) {
      /* ignore unsupported capture */
    }
    setPointerFromEvent(e);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!state.pointerActive && !(e.buttons & 1)) return;
    e.preventDefault();
    setPointerFromEvent(e);
  });

  function clearPointer(e) {
    if (e) e.preventDefault();
    state.pointerActive = false;
    state.pointerX = null;
  }

  canvas.addEventListener("pointerup", clearPointer);
  canvas.addEventListener("pointercancel", clearPointer);
  canvas.addEventListener("lostpointercapture", () => {
    state.pointerActive = false;
    state.pointerX = null;
  });

  // Block page scroll / pull-to-refresh while dragging on the stage.
  canvas.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      if (state.pointerActive && e.touches[0]) setPointerFromEvent(e.touches[0]);
    },
    { passive: false }
  );

  window.addEventListener("resize", () => {
    setupCanvas();
  });

  window.addEventListener("orientationchange", () => {
    setupCanvas();
  });

  primaryBtn.addEventListener("click", startGame);

  updateHud();
  showOverlay(
    "start",
    "Neon Catch",
    "Slide under glowing orbs. Avoid the dark voids. How long can you last?",
    "Play"
  );
  requestAnimationFrame(loop);
})();
