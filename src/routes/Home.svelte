<script>
  import { onMount } from "svelte";
  import { theme } from "../stores/theme.js";
  import ERstrokes from "../assets/ER_strokes_only_animated.svg";
  import ERBlack from "../assets/ER_nostrokes.svg";
  import CirclesGradient from "../effects/CirclesGradient.svelte";
  import RaysGradient from "../effects/RaysGradient.svelte";

  let currentTheme = $state($theme);
  let isLoaded = $state(false);
  let svgKey = $state(Date.now()); // Unique key to force SVG reload

  $effect(() => {
    currentTheme = $theme;
  });

  onMount(() => {
    // Force SVG animation restart by changing key on mount
    svgKey = Date.now();

    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      isLoaded = true;
    }, 200);
    return () => clearTimeout(timer);
  });
</script>

<div class="background-gradient">
  {#if currentTheme === "dark"}
    <RaysGradient />
  {:else}
    <CirclesGradient />
  {/if}
</div>

<div class="home-container">
  <div class="logo-section" class:loaded={isLoaded}>
    <div class="logo-stack">
      <div
        class="logo-wrapper animated-logo"
        style="width:89.5%;max-width:800px;position:absolute;top:0;left:3.8%;z-index:2;"
      >
        <img
          key={svgKey}
          src={`${ERstrokes}?v=${svgKey}`}
          alt="Animated Edgar Remy Logo"
          class="main-logo animated-svg"
        />
      </div>
      <div
        class="logo-wrapper static-logo"
        style="position:relative;z-index:1;"
      >
        <img src={ERBlack} alt="Edgar Remy Logo" class="main-logo" />
      </div>
    </div>
    <h1 class="name" class:visible={isLoaded}>Edgar Remy</h1>
  </div>
</div>

<style>
  .background-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    min-height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  /* Ensure the background gradient stretches to the full scrollable height if content is taller than viewport */
  :global(body) {
    min-height: 100vh;
    position: relative;
  }

  :global(html) {
    min-height: 100vh;
  }

  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 95vh;
    padding: 2rem;
    position: relative;
    z-index: 10;
  }

  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: transform 1s cubic-bezier(0.2, 0, 0.2, 1);
    z-index: 3;
  }

  /* When loaded, shift up to accommodate the name */
  .logo-section.loaded {
    transform: translateY(-2.5rem);
  }

  .logo-stack {
    position: relative;
    width: 100%;
    max-width: 800px;
    height: auto;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo-wrapper {
    width: 100%;
    max-width: 800px;
    height: auto;
  }
  .animated-logo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }
  .static-logo {
    position: relative;
    z-index: 1;
  }

  /* Glow effect container for dark theme */
  :global([data-theme="dark"]) .static-logo::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("../assets/ER_nostrokes.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    filter: invert(100%) sepia(20%) saturate(1620%) hue-rotate(293deg)
      brightness(101%) contrast(109%) blur(5px) brightness(1.5);
    opacity: 0;
    z-index: -1;
    pointer-events: none;
    animation:
      glow-fade-in 1.5s ease-out 2s forwards,
      glow-pulse 2.5s ease-in-out 3.5s infinite;
  }

  :global([data-theme="dark"]) .animated-logo::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("../assets/ER_strokes_only_animated.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    filter: invert(100%) sepia(20%) saturate(1620%) hue-rotate(293deg)
      brightness(101%) contrast(109%) blur(6px) brightness(300%);
    opacity: 0;
    z-index: -1;
    pointer-events: none;
    animation:
      glow-fade-in 1.5s ease-out 2s forwards,
      glow-pulse 2.5s ease-in-out 3.5s infinite;
  }

  .main-logo {
    width: 100%;
    max-width: 800px;
    height: auto;
    transition: transform 0.3s ease;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
    filter: brightness(0) saturate(100%);
  }

  :global([data-theme="light"]) .main-logo,
  :global(:root:not([data-theme="dark"])) .main-logo {
    filter: invert(5%) sepia(48%) saturate(1112%) hue-rotate(334deg)
      brightness(92%) contrast(92%);
  }

  :global([data-theme="dark"]) .main-logo {
    filter: invert(100%) sepia(20%) saturate(1620%) hue-rotate(293deg)
      brightness(101%) contrast(109%);
  }

  .name {
    font-family: "Young Serif", serif;
    font-size: 3.6rem;
    font-weight: 600;
    font-optical-sizing: auto;
    text-align: center;
    letter-spacing: -0.07em;
    transition:
      opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
      max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    width: 500px;
    max-width: 100%;
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    margin-top: 0.5rem;
    color: var(--text-primary);
  }

  :global([data-theme="dark"]) .name.visible {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0);
    animation:
      text-glow-fade-in 1.5s ease-out 1.5s forwards,
      text-glow-pulse 2.5s ease-in-out 3s infinite;
  }

  .name.visible {
    opacity: 1;
    max-height: 150px;
  }

  @keyframes glow-fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.65;
    }
  }

  @keyframes glow-pulse {
    0%,
    100% {
      opacity: 0.65;
    }
    50% {
      opacity: 0.25;
    }
  }

  @keyframes text-glow-fade-in {
    0% {
      text-shadow: 0 0 8px rgba(255, 255, 255, 0);
    }
    100% {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.55);
    }
  }

  @keyframes text-glow-pulse {
    0%,
    100% {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.55);
    }
    50% {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.15);
    }
  }

  @media (max-width: 768px) {
    .main-logo {
      max-width: 300px;
    }

    .name {
      font-size: 3rem;
      width: 300px;
    }
  }

  @media (max-width: 480px) {
    .main-logo {
      max-width: 250px;
    }

    .name {
      font-size: 2.5rem;
      width: 250px;
    }
  }
</style>
