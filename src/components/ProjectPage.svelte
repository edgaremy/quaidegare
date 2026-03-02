<!--
  ProjectPage — standardised layout for every project page.
  Props:
    title       — project title (required)
    subtitle    — optional one-line subtitle shown below title
    description — optional short paragraph shown in the header
    icon        — optional large emoji / glyph
    date        — ISO date string ("2025-09-01") or year-only string ("2025")
    url         — full project URL shown (and linked) in the header (e.g. "https://example.com")
    displayUrl  — optional shorter label for the URL (e.g. "example.com"); falls back to url
  Slot:
    default     — per-project body content; use <h2> for section headings
                  and <p> for paragraphs — they are styled automatically.
-->
<script>
  import { onMount } from "svelte";
  import { goto } from "@mateothegreat/svelte5-router";
  import { ArrowLeft } from "@lucide/svelte";

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
    children,
  } = $props();

  // Uppercase alias required for Svelte 5 dynamic component syntax
  const IconComponent = $derived(iconComponent);

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
  <button class="back-btn" onclick={goBack} type="button" aria-label="Back to projects">
    <ArrowLeft size={18} strokeWidth={2} />
    <span>Projects</span>
  </button>

  <!-- ─── Header ──────────────────────────────────────────────────────────── -->
  <header class="project-header">
    <div class="header-row">
      {#if iconSnippet}
        <div class="project-icon" aria-hidden="true">{@render iconSnippet()}</div>
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
        {#if subtitle}
          <p class="project-subtitle">{subtitle}</p>
        {/if}
      </div>
    </div>

    {#if url}
      {@const isExternal = url.startsWith("http://") || url.startsWith("https://")}
      <a
        class="project-url"
        href={url}
        target={isExternal ? "_blank" : null}
        rel={isExternal ? "noopener noreferrer" : null}
      >{displayUrl || url}</a>
    {/if}

    {#if date}
      <time class="project-date" datetime={date}>{formatDate(date)}</time>
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
    font-size: 0.88rem;
    cursor: pointer;
    transition: color 0.2s ease, gap 0.15s ease;
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
  }

  .header-row {
    display: flex;
    align-items: center;
    gap: 1.4rem;
    margin-bottom: 0.8rem;
  }

  .project-icon {
    font-size: 4rem;
    line-height: 1;
    flex-shrink: 0;
    user-select: none;
    pointer-events: none;
    -webkit-user-drag: none;
  }

  .project-icon-img {
    width: 12rem;
    height: 12rem;
    object-fit: contain;
    display: block;
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
  }

  .project-icon-component {
    width: 12rem;
    height: 12rem;
    pointer-events: none;
    user-select: none;
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
    color: var(--text-primary);
    margin: 0;
    line-height: 1.1;
  }

  .project-subtitle {
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--text-secondary, #888);
    margin: 0;
  }

  .project-url {
    display: inline-block;
    font-size: 0.82rem;
    color: var(--accent-primary, #667eea);
    text-decoration: none;
    margin-bottom: 0.4rem;
    opacity: 0.8;
    transition: opacity 0.2s;
  }

  .project-url:hover {
    opacity: 1;
    text-decoration: underline;
  }

  .project-date {
    display: block;
    font-size: 0.85rem;
    color: var(--text-secondary, #888);
    margin-bottom: 1rem;
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
    margin: 0;
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
  }
</style>
