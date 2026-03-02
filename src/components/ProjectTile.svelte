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
    const bg   = currentTheme === "dark" ? hoverBgDark   : hoverBgLight;
    const text = currentTheme === "dark" ? hoverTextDark : hoverTextLight;
    let s = "";
    if (bg)   s += `--tile-hover-bg: ${bg};`;
    if (text) s += `--tile-hover-text: ${text};`;
    return s;
  });

  function navigate() {
    goto(`/${slug}`);
  }
</script>

<button class="project-tile" class:dark={currentTheme === "dark"} onclick={navigate} type="button" style={customHoverStyle}>
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

  /* ── Holographic shine layer ── */
  .project-tile::before {
    content: '';
    position: absolute;
    inset: 0;
    /* A diagonal band that sweeps across the card */
    background: linear-gradient(
      115deg,
      transparent 0%,
      transparent 40%,
      rgba(255, 255, 255, 1.0) 50%,
      transparent 60%,
      transparent 100%
    );
    /* Start off-screen to the left */
    transform: translateX(-120%);
    opacity: 0;
    transition:
      transform 0s ease,
      opacity 0.15s ease;
    pointer-events: none;
    z-index: 1;
    border-radius: inherit;
  }

  /* On hover / active (mobile tap): sweep the shine across, then fade out */
  .project-tile:hover::before,
  .project-tile:active::before {
    transform: translateX(120%);
    opacity: 1;
    transition:
      transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      opacity 0.15s ease;
  }

  /* Dark theme: tone down the shine so it doesn't blow out the card */
  .project-tile.dark:hover::before,
  .project-tile.dark:active::before {
    opacity: 0.4;
  }

  /* Make all tile children sit above the shine layer */
  .project-tile > * {
    position: relative;
    z-index: 2;
  }

  .project-tile:hover,
  .project-tile:active {
    /* Falls back to default card-bg-hover when no custom color is provided */
    background: var(--tile-hover-bg, var(--card-bg-hover));
    /* Border uses the same hue as text, with 30% transparency */
    border-color: color-mix(in srgb, var(--tile-hover-text, var(--accent-primary, #667eea)), transparent 30%);
    border-bottom-width: 6px;
    transform: translateY(-2px);
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
    font-size: 4rem;
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
</style>
