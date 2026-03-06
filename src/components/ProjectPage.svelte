<!--
  ProjectPage — standardised layout for every project page.
  Props:
    title           — project title (required)
    subtitle        — optional one-line subtitle shown below title
    description     — optional short paragraph shown in the header
    icon            — optional large emoji / glyph
    date            — ISO date string ("2025-09-01") or year-only string ("2025")
    url             — full project URL shown (and linked) in the header (e.g. "https://example.com")
    displayUrl      — optional shorter label for the URL (e.g. "example.com"); falls back to url
    hoverBgLight    — optional CSS color for the header card bg in light theme
    hoverBgDark     — optional CSS color for the header card bg in dark theme
    hoverTextLight  — optional CSS color for the header accent (border/shadow) in light theme
    hoverTextDark   — optional CSS color for the header accent (border/shadow) in dark theme
  Slot:
    default     — per-project body content; use <h2> for section headings
                  and <p> for paragraphs — they are styled automatically.
-->
<script>
  import { onMount } from "svelte";
  import { goto } from "@mateothegreat/svelte5-router";
  import { ArrowLeft } from "@lucide/svelte";
  import { theme } from "../stores/theme.js";

  const {
    title,
    subtitle = "",
    description = "",
    icon = "",
    iconSnippet = null,
    iconComponent = null,
    date,
    url = "",
    displayUrl = "",
    // Custom accent/bg colors — same contract as ProjectTile
    hoverBgLight = "",
    hoverBgDark = "",
    hoverTextLight = "",
    hoverTextDark = "",
    children,
  } = $props();

  // Uppercase alias required for Svelte 5 dynamic component syntax
  const IconComponent = $derived(iconComponent);

  // Track current theme for custom color switching
  let currentTheme = $state($theme);
  $effect(() => { currentTheme = $theme; });

  // Build inline style string for custom CSS vars on the header
  const headerStyle = $derived.by(() => {
    const bg   = currentTheme === "dark" ? hoverBgDark   : hoverBgLight;
    const text = currentTheme === "dark" ? hoverTextDark : hoverTextLight;
    let s = "";
    if (bg)   s += `--hdr-bg: ${bg};`;
    if (text) s += `--hdr-accent: ${text};`;
    return s;
  });

  onMount(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  });

  /**
   * Formats the date string for display.
   * - A 4-digit year string (e.g. "2025") → "2025"
   * - A full ISO string (e.g. "2025-09-01") → "September 2025"
   */
  function formatDate(isoString) {
    if (!isoString) return "";
    if (/^\d{4}$/.test(isoString.trim())) return isoString.trim(); // year-only
    const d = new Date(isoString);
    return d.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
    });
  }

  function goBack() {
    goto("/projects");
  }
</script>

<article class="project-page">
  <!-- ─── Back button ──────────────────────────────────────────────────────── -->
  <button
    class="back-btn"
    onclick={goBack}
    type="button"
    aria-label="Back to projects"
  >
    <ArrowLeft size={18} strokeWidth={2} />
    <span>Projects</span>
  </button>

  <!-- ─── Header ──────────────────────────────────────────────────────────── -->
  <header
    class="project-header"
    class:dark={currentTheme === "dark"}
    style={headerStyle}
  >
    <div class="header-row">
      {#if iconSnippet}
        <div class="project-icon" aria-hidden="true">
          {@render iconSnippet()}
        </div>
      {:else if IconComponent}
        <div class="project-icon project-icon-component" aria-hidden="true">
          <IconComponent />
        </div>
      {:else if icon}
        <div class="project-icon" aria-hidden="true">
          {#if icon.startsWith("/")}
            <img src={icon} alt="" class="project-icon-img" draggable="false" />
          {:else}
            {icon}
          {/if}
        </div>
      {/if}
      <div class="header-text">
        <h1 class="project-title">{title}</h1>
        <!-- date – url on one line, always inside the grid cell -->
        {#if date || url}
          <div class="meta-row">
            {#if date}
              <time class="project-date" datetime={date}>{formatDate(date)}</time>
            {/if}
            {#if date && url}<span class="meta-sep">&nbsp;&ndash;&nbsp;</span>{/if}
            {#if url}
              {@const isExternal =
                url.startsWith("http://") || url.startsWith("https://")}
              <a
                class="project-url"
                href={url}
                target={isExternal ? "_blank" : null}
                rel={isExternal ? "noopener noreferrer" : null}>{displayUrl || url}↗</a
              >
            {/if}
          </div>
        {/if}
        {#if subtitle}
          <p class="project-subtitle subtitle-in-row">{subtitle}</p>
        {/if}
      </div>
    </div>

    <!-- Mobile-only: subtitle shown below the header-row -->
    {#if subtitle}
      <p class="project-subtitle subtitle-below">{subtitle}</p>
    {/if}

    {#if description}
      <p class="project-description">{description}</p>
    {/if}

    <hr class="header-divider" />
  </header>

  <!-- ─── Body ────────────────────────────────────────────────────────────── -->
  <div class="project-body">
    {@render children?.()}
  </div>
</article>

<style>
  .project-page {
    max-width: 780px;
    margin: 2rem auto 4rem;
    padding: 0 1rem;
  }

  /* ── Back button ── */
  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    background: none;
    border: none;
    padding: 0;
    margin-bottom: 2rem;
    color: var(--text-secondary, #888);
    font: inherit;
    font-size: 1.15rem;
    cursor: pointer;
    transition:
      color 0.2s ease,
      gap 0.15s ease;
  }

  .back-btn:hover {
    color: var(--accent-primary, #667eea);
    gap: 0.5rem;
    font-weight: 900;
  }

  .back-btn :global(svg) {
    flex-shrink: 0;
    transition: transform 0.15s ease;
  }

  .back-btn:hover :global(svg) {
    transform: translateX(-2px);
    stroke-width: 3;
  }

  /* ── Header ── */
  .project-header {
    margin-bottom: 2.5rem;
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    padding: 1.5rem 2rem;
    /* Project-specific background (needed for blend modes to render) */
    background: var(--hdr-bg, var(--card-bg, rgba(128, 128, 128, 0.08)));
    backdrop-filter: blur(35px) saturate(65%);
    -webkit-backdrop-filter: blur(35px) saturate(65%);
    border: 1px solid color-mix(
      in srgb,
      var(--hdr-accent, var(--accent-primary, #667eea)),
      transparent 30%
    );
    box-shadow: inset 0 -5px 0 0 color-mix(
      in srgb,
      var(--hdr-accent, var(--accent-primary, #667eea)),
      transparent 30%
    );
  }

  /* ── Holographic sweep layer (iridescent sweep on hover) ── */
  .project-header::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      150deg,
      transparent 0%,
      transparent 20%,
      oklch(0.62 0.24 200 / 0.8) 40%,
      oklch(0.58 0.28 280 / 1) 44%,
      oklch(0.65 0.22 320 / 1) 54%,
      oklch(0.63 0.2 60 / 0.9) 60%,
      transparent 80%,
      transparent 100%
    );
    mix-blend-mode: overlay;
    /* Start off-screen to the left */
    transform: translateX(-120%) translateY(-60%) scaleX(0.5) scaleY(3);
    opacity: 0;
    transition:
      transform 0s ease,
      opacity 0.1s ease;
    pointer-events: none;
    z-index: 1;
  }

  .project-header.dark::before {
    background: linear-gradient(
      150deg,
      transparent 0%,
      transparent 20%,
      oklch(89.399% 0.13197 200.492 / 0.6) 40%,
      oklch(69.052% 0.16623 280.369) 44%,
      oklch(83.077% 0.16472 326.904) 54%,
      oklch(83.25% 0.12194 64.764 / 0.9) 60%,
      transparent 80%,
      transparent 100%
    );
  }

  /* On hover / active: sweep the shine across */
  .project-header:hover::before,
  .project-header:active::before {
    transform: translateX(170%) translateY(60%) scaleX(3.5) scaleY(2);
    opacity: 1;
    transition:
      transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      opacity 0.1s ease;
  }

  /* Dark theme: slightly reduced — screen on dark is already punchy */
  .project-header.dark:hover::before,
  .project-header.dark:active::before {
    opacity: 1;
  }

  /* ── Holographic ambient layer (always on) ── */
  .project-header::after {
    content: "";
    position: absolute;
    inset: 0px; /* compensate for blur edge bleed */
    background: conic-gradient(
      from 0deg at 60% 40%,
      oklch(0.68 0.22 60 / 0.65),
      oklch(0.6 0.26 180 / 0.75),
      oklch(0.65 0.24 300 / 0.7),
      oklch(0.68 0.22 60 / 0.65)
    );
    mix-blend-mode: multiply;
    opacity: 0.2;
    animation: holo-drift 25s ease-in-out infinite;
    pointer-events: none;
    z-index: 1;
  }

  .project-header.dark::after {
    background: conic-gradient(
      from 0deg at 60% 40%,
      oklch(0.8 0.16 60 / 0.5),
      oklch(69.373% 0.12928 176.427 / 0.5),
      oklch(81.736% 0.11755 306.815 / 0.5),
      oklch(0.8 0.16 60 / 0.5)
    );
    mix-blend-mode: color-dodge;
    opacity: 0.15;
  }

  /* All header children must sit above the pseudo-element layers */
  .project-header > * {
    position: relative;
    z-index: 2;
  }

  /* The hr divider is replaced by the card's bottom shadow */
  .project-header .header-divider {
    display: none;
  }

  @keyframes holo-drift {
    0%,  100% { filter: hue-rotate(0deg)   brightness(1);    }
    33%        { filter: hue-rotate(60deg)  brightness(1.06); }
    66%        { filter: hue-rotate(-45deg) brightness(0.96); }
  }

  /* Reduced-motion: skip sweep transition, show static tint on hover */
  @media (prefers-reduced-motion: reduce) {
    .project-header::before {
      transition: opacity 0.2s ease !important;
    }
    .project-header::after {
      animation: none !important;
    }
    .project-header:hover::before,
    .project-header:active::before {
      transform: none;
      opacity: 0.6;
    }
  }

  .header-row {
    display: flex;
    align-items: center;
    gap: 1.4rem;
    margin-bottom: 0.8rem;
  }

  .project-icon {
    font-size: 6rem;
    line-height: 1;
    flex-shrink: 0;
    color: var(--hdr-accent, var(--text-primary));
    user-select: none;
    pointer-events: none;
    -webkit-user-drag: none;
  }

  .project-icon-img {
    max-width: 12rem;
    height: 12rem;
    object-fit: contain;
    display: block;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
  }

  .project-icon-component {
    max-width: 12rem;
    height: 12rem;
    pointer-events: none;
    user-select: none;
  }

  @media (max-width: 480px) {
    .project-icon-img,
    .project-icon-component {
      max-width: 6rem;
      height: 6rem;
    }
  }

  .header-text {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }

  .project-title {
    font-family: "Young Serif", serif;
    font-size: 3rem;
    font-weight: 600;
    letter-spacing: -0.04em;
    color: var(--hdr-accent, var(--text-primary));
    margin: 0;
    line-height: 1.1;
  }

  .project-subtitle {
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--hdr-accent, var(--text-secondary, #888));
    opacity: 0.75;
    margin: 0;
  }

  .project-url {
    display: inline;
    font-size: 1.25rem;
    color: var(--hdr-accent, var(--accent-primary, #667eea));
    text-decoration: none;
    opacity: 0.9;
    transition: opacity 0.2s ease;
  }

  .project-url:hover {
    opacity: 1;
    text-decoration: underline;
  }

  .project-date {
    display: inline;
    font-size: 1.25rem;
    color: var(--hdr-accent, var(--text-secondary, #888));
    opacity: 0.75;
  }

  .meta-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 0;
    margin-bottom: 0.4rem;
  }

  .meta-sep {
    font-size: 1.25rem;
    color: var(--hdr-accent, var(--text-secondary));
    opacity: 0.75;
  }

  /* Desktop: subtitle inside row; below-subtitle hidden */
  .subtitle-below {
    display: none;
  }

  /* Mobile: hide subtitle in row, show it below */
  @media (max-width: 640px) {
    .subtitle-in-row {
      display: none;
    }

    .subtitle-below {
      display: block;
      font-size: 1.05rem;
      font-weight: 400;
      color: var(--hdr-accent, var(--text-secondary, #888));
      opacity: 0.75;
      margin: 0.5rem 0 0;
    }
  }

  .project-description {
    font-size: 1rem;
    line-height: 1.7;
    color: var(--text-primary);
    margin: 0 0 1.2rem;
  }

  .header-divider {
    border: none;
    border-top: 1px solid var(--card-border, rgba(128, 128, 128, 0.2));
    margin-top: 1.25rem;
  }

  /* ── Body — standardise heading & paragraph formatting ── */
  .project-body {
    margin-top: 2rem;
  }

  .project-body :global(h2) {
    font-family: "Young Serif", serif;
    font-size: 1.5rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: var(--text-primary);
    margin: 2rem 0 0.6rem;
  }

  .project-body :global(h3) {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 1.4rem 0 0.4rem;
  }

  .project-body :global(p) {
    font-size: 0.97rem;
    line-height: 1.75;
    color: var(--text-primary);
    margin: 0 0 1rem;
  }

  .project-body :global(code) {
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 0.88em;
    background: var(--card-bg, rgba(128, 128, 128, 0.1));
    border-radius: 4px;
    padding: 0.15em 0.4em;
  }

  .project-body :global(img) {
    width: 100%;
    border-radius: 8px;
    margin: 1.5rem 0;
  }

  .project-body :global(ul),
  .project-body :global(ol) {
    padding-left: 1.4rem;
    margin: 0 0 1rem;
  }

  .project-body :global(li) {
    font-size: 0.97rem;
    line-height: 1.7;
    color: var(--text-primary);
    margin-bottom: 0.3rem;
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .project-page {
      margin: 1rem auto 3rem;
    }

    .project-title {
      font-size: 2rem;
    }

    .project-icon {
      font-size: 3rem;
    }

    .header-row {
      gap: 1rem;
    }

    .project-header {
      padding: 1.25rem 1.4rem;
      margin-inline: -1rem;
    }

    .project-url, .project-date {
      font-size: 0.9rem;
    }
  }
</style>
