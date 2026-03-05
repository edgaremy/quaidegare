<!--
  ProjectTile — a clickable card shown in the projects grid.
  Props:
    title           — project title (required)
    subtitle        — optional one-line subtitle
    icon            — optional emoji/glyph OR a Vite-resolved image URL (string starting with /)
    iconComponent   — optional Svelte component used instead of icon (takes priority)
    slug            — URL slug used for routing (e.g. "collabst" → navigates to "/collabst")
    hoverBgLight    — optional CSS color for the card background on hover in light theme
    hoverBgDark     — optional CSS color for the card background on hover in dark theme
    hoverTextLight  — optional CSS color for text (title/subtitle) on hover in light theme
    hoverTextDark   — optional CSS color for text (title/subtitle) on hover in dark theme

  Custom color example:
    <ProjectTile
      hoverBgLight="#f0e6ff"
      hoverBgDark="#2d1a4a"
      hoverTextLight="#3b1f7a"
      hoverTextDark="#d4aaff"
      ...
    />
-->
<script>
  import { goto } from "@mateothegreat/svelte5-router";
  import { theme } from "../stores/theme.js";

  const {
    title,
    subtitle = "",
    icon = "",
    iconComponent = null,
    slug,
    // Custom hover colors — provide all four or none.
    // Each accepts any valid CSS color string.
    hoverBgLight = "",
    hoverBgDark = "",
    hoverTextLight = "",
    hoverTextDark = "",
  } = $props();

  // Vite-resolved asset URLs start with "/". Emoji/glyphs never do.
  const iconIsImage = $derived(icon.startsWith("/"));
  // Uppercase alias required for Svelte 5 dynamic component syntax
  const IconComponent = $derived(iconComponent);

  // Track current theme for custom color switching
  let currentTheme = $state($theme);
  $effect(() => {
    currentTheme = $theme;
  });

  // Build inline style string for custom hover color CSS vars.
  // Falls back to default hover styles when props are not provided.
  const customHoverStyle = $derived.by(() => {
    const bg = currentTheme === "dark" ? hoverBgDark : hoverBgLight;
    const text = currentTheme === "dark" ? hoverTextDark : hoverTextLight;
    let s = "";
    if (bg) s += `--tile-hover-bg: ${bg};`;
    if (text) s += `--tile-hover-text: ${text};`;
    return s;
  });

  function navigate() {
    goto(`/${slug}`);
  }
</script>

<button
  class="project-tile"
  class:dark={currentTheme === "dark"}
  onclick={navigate}
  type="button"
  style={customHoverStyle}
>
  {#if IconComponent}
    <div class="tile-icon tile-icon-component" aria-hidden="true">
      <IconComponent />
    </div>
  {:else if icon}
    <div class="tile-icon" aria-hidden="true">
      {#if iconIsImage}
        <img src={icon} alt="" class="tile-icon-img" draggable="false" />
      {:else}
        {icon}
      {/if}
    </div>
  {/if}
  <h3 class="tile-title">{title}</h3>
  {#if subtitle}
    <p class="tile-subtitle">{subtitle}</p>
  {/if}
</button>

<style>
  .project-tile {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    padding: 1.4rem 1.6rem;
    background: transparent;
    backdrop-filter: blur(35px) saturate(65%);
    -webkit-backdrop-filter: blur(35px) saturate(65%);
    border: 1px solid color-mix(in srgb, var(--bg-primary), transparent 40%);
    border-radius: 30px;
    cursor: pointer;
    text-align: left;
    /* Holographic shine needs relative + overflow hidden */
    position: relative;
    overflow: hidden;
    transition:
      background 0.4s ease,
      border-color 0.2s ease,
      transform 0.15s ease,
      box-shadow 0.2s ease,
      color 0.4s ease;
    width: fit-content;
    max-width: 17.5rem;
    font: inherit;
    color: inherit;
  }

  /* ── Holographic shine layer (iridescent sweep) ── */
  .project-tile::before {
    content: "";
    position: absolute;
    inset: 0;
    /* LIGHT THEME: overlay blend + darker stops so the tints show on white */
    background: linear-gradient(
      135deg,
      transparent 0%,
      transparent 20%,
      oklch(0.62 0.24 200 / 0.7) 34%,
      oklch(0.58 0.28 280 / 0.8) 44%,
      oklch(0.65 0.22 320 / 0.75) 54%,
      oklch(0.63 0.2 60 / 0.65) 67%,
      transparent 80%,
      transparent 100%
    );
    mix-blend-mode: overlay;
    /* Start off-screen to the left */
    transform: translateX(-140%);
    opacity: 0;
    transition:
      transform 0s ease,
      opacity 0.15s ease;
    pointer-events: none;
    z-index: 1;
  }

  /* DARK THEME sweep: screen blend + wide feather zones = soft, blurry edges */
  .project-tile.dark::before {
    background: linear-gradient(
      135deg,
      transparent 0%,
      transparent 10%,
      oklch(89.399% 0.13197 200.492 / 0.7) 38%,
      oklch(69.052% 0.16623 280.369) 44%,
      oklch(83.077% 0.16472 326.904) 54%,
      oklch(83.25% 0.12194 64.764 / 0.7) 64%,
      transparent 90%,
      transparent 100%
    );
  }

  /* On hover / active (mobile tap): sweep the shine across, then fade out */
  .project-tile:hover::before,
  .project-tile:active::before {
    transform: translateX(140%);
    opacity: 1;
    transition:
      transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      opacity 0.3s ease;
  }

  /* Dark theme hover: slightly reduced — screen on dark is already punchy */
  .project-tile.dark:hover::before,
  .project-tile.dark:active::before {
    opacity: 0.75;
  }

  /* ── Holographic ambient layer (conic glow, persistent on hover) ── */
  .project-tile::after {
    content: "";
    position: absolute;
    inset: 0;
    /* LIGHT THEME: more saturated stops; multiply makes them visible on white */
    background: conic-gradient(
      from 0deg at 60% 40%,
      oklch(0.68 0.22 60 / 0.65),
      oklch(0.6 0.26 180 / 0.75),
      oklch(0.65 0.24 300 / 0.7),
      oklch(0.68 0.22 60 / 0.65)
    );
    mix-blend-mode: multiply;
    opacity: 0;
    transition: opacity 0.45s ease;
    pointer-events: none;
    z-index: 1;
  }

  /* DARK THEME ambient: color-dodge brightens the dark card with colour */
  .project-tile.dark::after {
    background: conic-gradient(
      from 0deg at 60% 40%,
      oklch(0.8 0.16 60 / 0.3),
      oklch(0.75 0.2 180 / 0.42),
      oklch(0.8 0.18 300 / 0.35),
      oklch(0.8 0.16 60 / 0.3)
    );
    mix-blend-mode: color-dodge;
  }

  /* Light */
  .project-tile:hover::after,
  .project-tile:active::after {
    opacity: 0.2;
    animation: holo-drift 5s ease-in-out infinite;
  }

  /* Dark */
  .project-tile.dark:hover::after,
  .project-tile.dark:active::after {
    opacity: 0.3;
  }

  /* Make all tile children sit above the shine layer */
  .project-tile > * {
    position: relative;
    z-index: 2;
  }

  .project-tile:hover,
  .project-tile:active {
    background: var(--tile-hover-bg, var(--card-bg-hover));
    border-color: color-mix(
      in srgb,
      var(--tile-hover-text, var(--accent-primary, #667eea)),
      transparent 30%
    );
    border-bottom-width: 6px;
    transform: translateY(-4px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
  }

  .project-tile:active {
    transform: translateY(0);
  }

  /* Apply custom text color to title/subtitle on hover when provided */
  .project-tile:hover .tile-title,
  .project-tile:active .tile-title {
    color: var(--tile-hover-text, var(--text-primary));
    transition: color 0.5s ease;
  }

  .project-tile:hover .tile-subtitle,
  .project-tile:active .tile-subtitle {
    color: var(--tile-hover-text, var(--text-secondary, #888));
    opacity: var(--tile-hover-text-opacity, 1);
    transition: color 0.5s ease;
  }

  .tile-icon {
    font-size: 6rem;
    line-height: 1;
    margin-bottom: 0.3rem;
    user-select: none;
    pointer-events: none;
    -webkit-user-drag: none;
  }

  .tile-icon-img {
    max-width: 14rem;
    height: 14rem;
    object-fit: contain;
    display: block;
    user-select: none;
    pointer-events: none;
    -webkit-user-drag: none;
  }

  .project-tile:hover .tile-icon,
  .project-tile:active .tile-icon,
  .project-tile:hover .tile-icon-img,
  .project-tile:active .tile-icon-img {
    color: var(--tile-hover-text, var(--text-primary));
  }

  .tile-icon-component {
    max-width: 14rem;
    height: 14rem;
    pointer-events: none;
    user-select: none;
  }

  .tile-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.3;
    letter-spacing: -0.02em;
  }

  .tile-subtitle {
    font-size: 0.88rem;
    font-weight: 400;
    color: var(--text-secondary, #888);
    margin: 0;
    line-height: 1.4;
  }

  /* ── Holographic drift keyframe ── */
  @keyframes holo-drift {
    0%,
    100% {
      filter: hue-rotate(0deg) brightness(1);
    }
    33% {
      filter: hue-rotate(60deg) brightness(1.06);
    }
    66% {
      filter: hue-rotate(-45deg) brightness(0.96);
    }
  }

  /* ── Accessibility: respect reduced-motion preference ── */
  @media (prefers-reduced-motion: reduce) {
    .project-tile::before,
    .project-tile::after {
      animation: none !important;
      transition: opacity 0.2s ease !important;
    }
    /* Show a static tint instead of the sweep */
    .project-tile:hover::before,
    .project-tile:active::before {
      transform: none;
      opacity: 0.6;
    }
  }
</style>
