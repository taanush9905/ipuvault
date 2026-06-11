<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>IPUVault — Under Construction</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root {
    --lime: #AAFF00;
    --lime-dim: #88CC00;
    --lime-glow: rgba(170,255,0,0.18);
    --lime-glow-strong: rgba(170,255,0,0.38);
  }

  [data-theme="dark"] {
    --bg: #0a0a0a;
    --bg2: #111111;
    --bg3: #1a1a1a;
    --card: #141414;
    --border: rgba(170,255,0,0.15);
    --border-bright: rgba(170,255,0,0.4);
    --text: #f0f0f0;
    --text-muted: #888;
    --shadow-color: rgba(0,0,0,0.6);
  }

  [data-theme="light"] {
    --bg: #f2f7e8;
    --bg2: #eaf2d6;
    --bg3: #ddecc0;
    --card: #ffffff;
    --border: rgba(100,160,0,0.2);
    --border-bright: rgba(100,160,0,0.6);
    --text: #1a1a1a;
    --text-muted: #555;
    --shadow-color: rgba(80,130,0,0.12);
    --lime: #5a9900;
    --lime-dim: #447700;
    --lime-glow: rgba(90,153,0,0.13);
    --lime-glow-strong: rgba(90,153,0,0.28);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  html, body {
    height: 100%;
    max-height: 100vh;
    font-family: 'Space Grotesk', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow: hidden;
    transition: background 0.4s, color 0.4s;
  }

  /* ── Background grid ── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(var(--border) 1px, transparent 1px),
      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Theme toggle ── */
  .theme-toggle {
    position: fixed;
    top: 1.2rem;
    right: 1.4rem;
    z-index: 100;
    background: var(--card);
    border: 1.5px solid var(--border-bright);
    border-radius: 50px;
    padding: 6px 14px;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.72rem;
    color: var(--lime);
    letter-spacing: 0.05em;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.25s;
    box-shadow: 0 0 12px var(--lime-glow);
  }
  .theme-toggle:hover {
    background: var(--lime);
    color: #000;
    box-shadow: 0 0 22px var(--lime-glow-strong);
  }
  .theme-toggle .icon { font-size: 1rem; }

  /* ── Nav logo ── */
  .logo {
    position: fixed;
    top: 1.1rem;
    left: 1.4rem;
    z-index: 100;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.08em;
    color: var(--lime);
    text-shadow: 0 0 14px var(--lime-glow-strong);
  }
  .logo span { color: var(--text); }

  /* ── Main container ── */
  .container {
    position: relative;
    z-index: 1;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4.5rem 1.5rem 2rem;
    gap: 0;
    overflow: hidden;
  }

  /* ── 3D Scene ── */
  .scene {
    position: relative;
    width: 320px;
    height: 200px;
    perspective: 900px;
    margin-bottom: 1.2rem;
    flex-shrink: 0;
  }

  /* Monitor body */
  .monitor {
    position: absolute;
    left: 50%;
    bottom: 30px;
    transform: translateX(-50%) rotateX(8deg) rotateY(-6deg);
    width: 210px;
    height: 138px;
    background: linear-gradient(145deg, var(--bg3) 0%, var(--bg2) 100%);
    border: 2px solid var(--border-bright);
    border-radius: 10px;
    box-shadow:
      8px 8px 0 var(--bg3),
      16px 16px 0 var(--bg2),
      0 30px 60px var(--shadow-color),
      inset 0 0 30px var(--lime-glow);
    overflow: hidden;
    animation: float 4s ease-in-out infinite;
  }

  .monitor-screen {
    margin: 8px;
    height: calc(100% - 16px);
    background: var(--bg);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 6px;
    overflow: hidden;
    position: relative;
  }

  /* Scanline effect on screen */
  .monitor-screen::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(170,255,0,0.03) 3px,
      rgba(170,255,0,0.03) 4px
    );
    pointer-events: none;
  }

  .screen-text {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.55rem;
    color: var(--lime);
    text-align: center;
    padding: 0 8px;
    line-height: 1.6;
    opacity: 0.85;
  }

  .screen-cursor {
    display: inline-block;
    width: 6px;
    height: 11px;
    background: var(--lime);
    animation: blink 1s step-end infinite;
    margin-left: 2px;
    vertical-align: middle;
  }

  /* Monitor stand */
  .monitor-stand {
    position: absolute;
    bottom: 22px;
    left: 50%;
    transform: translateX(-42%);
    width: 40px;
    height: 18px;
    background: var(--bg3);
    border: 1.5px solid var(--border-bright);
    border-radius: 3px;
    box-shadow: 4px 4px 0 var(--bg2);
  }

  .monitor-base {
    position: absolute;
    bottom: 14px;
    left: 50%;
    transform: translateX(-48%);
    width: 70px;
    height: 10px;
    background: var(--bg3);
    border: 1.5px solid var(--border-bright);
    border-radius: 4px;
    box-shadow: 4px 4px 0 var(--bg2);
  }

  /* Crane arm */
  .crane {
    position: absolute;
    right: 10px;
    top: 0;
    width: 14px;
    height: 170px;
    background: linear-gradient(90deg, var(--lime), var(--lime-dim));
    border-radius: 4px;
    transform: rotateX(8deg);
    box-shadow: 3px 3px 0 var(--lime-dim), 0 0 20px var(--lime-glow-strong);
    animation: cranePulse 3s ease-in-out infinite;
  }

  .crane-arm {
    position: absolute;
    top: 4px;
    right: 6px;
    width: 80px;
    height: 10px;
    background: var(--lime);
    border-radius: 3px;
    box-shadow: 3px 3px 0 var(--lime-dim), 0 0 14px var(--lime-glow-strong);
  }

  .crane-wire {
    position: absolute;
    top: 14px;
    right: 6px;
    width: 1.5px;
    height: 50px;
    background: var(--text-muted);
    animation: swing 3s ease-in-out infinite;
    transform-origin: top center;
  }

  .crane-hook {
    position: absolute;
    bottom: -16px;
    left: -10px;
    width: 22px;
    height: 22px;
    background: var(--card);
    border: 2px solid var(--lime);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    box-shadow: 0 0 10px var(--lime-glow-strong);
  }

  /* Warning sign */
  .warning-sign {
    position: absolute;
    left: 20px;
    bottom: 50px;
    width: 48px;
    height: 48px;
    background: #FFCC00;
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-bottom: 6px;
    font-size: 1rem;
    animation: warnPulse 2s ease-in-out infinite;
    filter: drop-shadow(0 0 8px rgba(255,204,0,0.6));
  }

  /* Barrier */
  .barrier {
    position: absolute;
    bottom: 35px;
    left: 50%;
    transform: translateX(-50%);
    width: 220px;
    height: 18px;
    background: repeating-linear-gradient(
      90deg,
      #FFCC00 0px,
      #FFCC00 24px,
      #1a1a1a 24px,
      #1a1a1a 48px
    );
    border-radius: 4px;
    border: 1.5px solid var(--border-bright);
    box-shadow: 0 4px 12px var(--shadow-color);
  }

  /* Worker figure left */
  .worker {
    position: absolute;
    font-size: 1.8rem;
    animation: workerBob 2s ease-in-out infinite;
  }
  .worker-left { bottom: 42px; left: 30px; animation-delay: 0.3s; }
  .worker-right { bottom: 42px; right: 50px; animation-delay: 0.7s; }

  /* ── Headline block ── */
  .headline {
    text-align: center;
    max-width: 560px;
    margin-bottom: 1rem;
  }

  .overline {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.2em;
    color: var(--lime);
    text-transform: uppercase;
    margin-bottom: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .overline::before, .overline::after {
    content: '';
    width: 28px;
    height: 1px;
    background: var(--lime);
    opacity: 0.5;
  }

  h1 {
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.03em;
    margin-bottom: 0.6rem;
  }
  h1 .accent { color: var(--lime); text-shadow: 0 0 30px var(--lime-glow-strong); }

  .desc {
    font-size: 1rem;
    color: var(--text-muted);
    line-height: 1.6;
    max-width: 420px;
    margin: 0 auto;
  }

  /* ── Progress bar ── */
  .progress-wrap {
    width: 100%;
    max-width: 380px;
    margin-bottom: 1.2rem;
  }
  .progress-label {
    display: flex;
    justify-content: space-between;
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.68rem;
    color: var(--text-muted);
    margin-bottom: 6px;
    letter-spacing: 0.06em;
  }
  .progress-track {
    height: 6px;
    background: var(--bg3);
    border-radius: 99px;
    border: 1px solid var(--border);
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    width: 0;
    background: linear-gradient(90deg, var(--lime), var(--lime-dim));
    border-radius: 99px;
    box-shadow: 0 0 12px var(--lime-glow-strong);
    animation: fillProgress 2.5s ease-out 0.5s forwards;
  }
  @keyframes fillProgress { to { width: 67%; } }

  /* ── Buttons ── */
  .buttons {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 0;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-family: 'Space Grotesk', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    border: 2px solid transparent;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }

  .btn-primary {
    background: var(--lime);
    color: #000;
    box-shadow: 0 0 20px var(--lime-glow-strong), 4px 4px 0 var(--lime-dim);
  }
  .btn-primary:hover {
    transform: translate(-2px, -2px);
    box-shadow: 0 0 30px var(--lime-glow-strong), 6px 6px 0 var(--lime-dim);
  }
  .btn-primary:active { transform: translate(2px, 2px); box-shadow: 0 0 10px var(--lime-glow); }

  .btn-ghost {
    background: transparent;
    color: var(--text);
    border-color: var(--border-bright);
    box-shadow: 4px 4px 0 var(--border);
  }
  .btn-ghost:hover {
    border-color: var(--lime);
    color: var(--lime);
    transform: translate(-2px, -2px);
    box-shadow: 0 0 16px var(--lime-glow), 6px 6px 0 var(--lime-glow-strong);
  }
  .btn-ghost:active { transform: translate(2px, 2px); }

  .btn-icon { font-size: 1rem; }

  /* ── Contact chips ── */
  .contact-row {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 0.4rem 0.9rem;
    border-radius: 99px;
    background: var(--card);
    border: 1.5px solid var(--border);
    font-size: 0.78rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: all 0.2s;
    font-family: 'JetBrains Mono', monospace;
    cursor: pointer;
  }
  .chip:hover {
    border-color: var(--lime);
    color: var(--lime);
    box-shadow: 0 0 14px var(--lime-glow);
    transform: translateY(-2px);
  }
  .chip-icon { font-size: 0.9rem; }

  /* ── Animations ── */
  @keyframes float {
    0%, 100% { transform: translateX(-50%) rotateX(8deg) rotateY(-6deg) translateY(0); }
    50%       { transform: translateX(-50%) rotateX(8deg) rotateY(-6deg) translateY(-8px); }
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes swing {
    0%, 100% { transform: rotate(-6deg); }
    50%      { transform: rotate(6deg); }
  }
  @keyframes workerBob {
    0%, 100% { transform: translateY(0); }
    50%      { transform: translateY(-5px); }
  }
  @keyframes warnPulse {
    0%, 100% { filter: drop-shadow(0 0 8px rgba(255,204,0,0.5)); }
    50%      { filter: drop-shadow(0 0 16px rgba(255,204,0,0.9)); }
  }
  @keyframes cranePulse {
    0%, 100% { box-shadow: 3px 3px 0 var(--lime-dim), 0 0 14px var(--lime-glow); }
    50%      { box-shadow: 3px 3px 0 var(--lime-dim), 0 0 28px var(--lime-glow-strong); }
  }

  /* ── Footer ── */
  footer {
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.62rem;
    color: var(--text-muted);
    letter-spacing: 0.1em;
    opacity: 0.6;
    white-space: nowrap;
  }

  /* ── Responsive ── */
  @media (max-width: 480px) {
    .scene { width: 280px; height: 185px; }
    .monitor { width: 180px; height: 118px; }
    h1 { font-size: 1.9rem; }
    .buttons { flex-direction: column; align-items: center; }
    .container { padding: 4rem 1rem 1.5rem; }
  }

  @media (max-height: 700px) {
    .scene { height: 170px; margin-bottom: 0.8rem; }
    .monitor { height: 110px; }
    h1 { font-size: 1.8rem; }
    .desc { font-size: 0.85rem; }
    .overline { margin-bottom: 0.2rem; }
  }
</style>
</head>
<body>

<!-- Logo -->
<div class="logo">IPU<span>Vault</span></div>

<!-- Theme Toggle -->
<button class="theme-toggle" onclick="toggleTheme()">
  <span class="icon" id="theme-icon">☀️</span>
  <span id="theme-label">LIGHT</span>
</button>

<!-- Main -->
<div class="container">

  <!-- 3D Scene -->
  <div class="scene">
    <!-- Monitor -->
    <div class="monitor">
      <div class="monitor-screen">
        <div class="screen-text">
          &gt; initializing...<br>
          &gt; src/core loading<br>
          &gt; build 0.67 / 1.0<br>
          &gt; eta: soon™<span class="screen-cursor"></span>
        </div>
      </div>
    </div>
    <div class="monitor-stand"></div>
    <div class="monitor-base"></div>

    <!-- Crane -->
    <div class="crane">
      <div class="crane-arm">
        <div class="crane-wire">
          <div class="crane-hook">⚙️</div>
        </div>
      </div>
    </div>

    <!-- Barrier -->
    <div class="barrier"></div>

    <!-- Warning sign -->
    <div class="warning-sign"></div>

    <!-- Workers -->
    <div class="worker worker-left">👷</div>
    <div class="worker worker-right">👷‍♀️</div>
  </div>

  <!-- Headline -->
  <div class="headline">
    <div class="overline">STATUS UPDATE</div>
    <h1>We're<br><span class="accent">Building</span> Something.</h1>
    <p class="desc">IPUVault is being assembled from scratch — a space for IPU resources, notes, and tools. Check back soon.</p>
  </div>

  <!-- Progress -->
  <div class="progress-wrap">
    <div class="progress-label">
      <span>BUILD PROGRESS</span>
      <span id="pct">0%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" id="fill"></div>
    </div>
  </div>

  <!-- CTA Buttons -->
  <div class="buttons">
    <a href="https://github.com/taanush9905" target="_blank" rel="noopener" class="btn btn-primary">
      <span class="btn-icon">🐙</span> GitHub
    </a>
    <a href="https://linkedin.com/in/taanush9905" target="_blank" rel="noopener" class="btn btn-ghost">
      <span class="btn-icon">💼</span> LinkedIn
    </a>
    <a href="mailto:taanush9905@gmail.com" class="btn btn-ghost">
      <span class="btn-icon">✉️</span> Email
    </a>
  </div>

</div>

<footer>IPUVAULT © 2026 &nbsp;·&nbsp; UNDER CONSTRUCTION</footer>

<script>
  // Theme toggle
  function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('theme-icon').textContent = isDark ? '🌙' : '☀️';
    document.getElementById('theme-label').textContent = isDark ? 'DARK' : 'LIGHT';
  }

  // Animate progress counter
  const fill = document.getElementById('fill');
  const pct = document.getElementById('pct');
  let count = 0;
  const target = 67;
  setTimeout(() => {
    const iv = setInterval(() => {
      count++;
      pct.textContent = count + '%';
      if (count >= target) clearInterval(iv);
    }, 35);
  }, 500);
</script>
</body>
</html>