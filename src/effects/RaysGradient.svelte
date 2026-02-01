<div class="rays-gradient-wrapper">
  <div class="rays-gradient"></div>
  <div class="noise-layer"></div>
</div>

<style>
  @keyframes smoothBg {
    from {
      background-position:
        50% 50%,
        50% 50%;
    }
    to {
      background-position:
        250% 50%,
        250% 50%;
    }
  }

  .rays-gradient-wrapper {
    width: 100%;
    min-height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
  }

  .rays-gradient {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    position: relative;
    top: 0;
    left: 0;
    display: flex;
    place-content: center;
    place-items: center;
    pointer-events: none;
    --stripe-color: var(--bg-primary);
    --stripes: repeating-linear-gradient(
      100deg,
      var(--stripe-color) 0%,
      var(--stripe-color) 7%,
      transparent 10%,
      transparent 12%,
      var(--stripe-color) 16%
    );

    --rainbow: repeating-linear-gradient(
      100deg,
      #60a5fa 0%,
      #ea72fd 15%,
      #60a5fa 20%,
      #5eead4 25%,
      #60a5fa 30%
    );
    background-image: var(--stripes), var(--rainbow);
    background-size: 300%, 200%;
    background-position:
      50% 50%,
      50% 50%;
    /* filter: blur(10px) invert(100%);
    opacity: 0.3; */
    filter: blur(10px) opacity(70%) saturate(200%);
    opacity: 0.4;
    mask-image: radial-gradient(ellipse at 60% 0%, black 35%, transparent 75%);
  }

  .rays-gradient::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image: var(--stripes), var(--rainbow);
    background-size: 300%, 100%;
    animation: smoothBg 60s linear infinite;
    background-attachment: fixed;
    mix-blend-mode: difference;
  }

  .noise-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100vh;
    pointer-events: none;
    z-index: 10;
    background: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='black' opacity='1.0'/%3E%3C/svg%3E");
    background-size: 100px 100px;
    background-repeat: repeat;
    mix-blend-mode: multiply;
    opacity: 0.3;
    mask-image:
      linear-gradient(
        100deg,
        transparent 15%,
        black 40%,
        #00000082 55%,
        black 70% transparent 95%
      ),
        radial-gradient(ellipse at 60% 0%, black 35%, transparent 60%);
    -webkit-mask-image:
      linear-gradient(
        100deg,
        transparent 15%,
        black 40%,
        #00000082 55%,
        black 70%,
        transparent 95%
      ),
        radial-gradient(ellipse at 60% 0%, black 35%, transparent 60%);
    mask-composite: intersect;
    -webkit-mask-composite: source-in;
  }

  /* Dark theme adjustments */
  /* :global([data-theme="dark"]) .rays-gradient {
    --stripe-color: #000000ed;
    filter: blur(10px) opacity(30%) saturate(200%);
    opacity: 0.75;
  }

  :global([data-theme="dark"]) .rays-gradient::after {
    filter: blur(10px) opacity(30%) saturate(200%);
  } */
</style>
