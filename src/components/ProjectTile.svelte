<!--
  ProjectTile — a clickable card shown in the projects grid.
  Props:
    title          — project title (required)
    subtitle       — optional one-line subtitle
    icon           — optional emoji/glyph OR a Vite-resolved image URL (string starting with /)
    iconComponent  — optional Svelte component used instead of icon (takes priority)
    slug           — URL slug used for routing (e.g. "collabst" → navigates to "/collabst")
-->
<script>
  import { goto } from "@mateothegreat/svelte5-router";

  const { title, subtitle = "", icon = "", iconComponent = null, slug } = $props();

  // Vite-resolved asset URLs start with "/". Emoji/glyphs never do.
  const iconIsImage = $derived(icon.startsWith("/"));
  // Uppercase alias required for Svelte 5 dynamic component syntax
  const IconComponent = $derived(iconComponent);

  function navigate() {
    goto(`/${slug}`);
  }
</script>

<button class="project-tile" onclick={navigate} type="button">
  {#if IconComponent}
    <div class="tile-icon tile-icon-component" aria-hidden="true">
      <IconComponent />
    </div>
  {:else if icon}
    <div class="tile-icon" aria-hidden="true">
      {#if iconIsImage}
        <img src={icon} alt="" class="tile-icon-img" />
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
    background: var(--card-bg);
    backdrop-filter: blur(14px) saturate(70%);
    -webkit-backdrop-filter: blur(14px) saturate(0%);
    border: 1px solid var(--card-border, rgba(128, 128, 128, 0.15));
    border-radius: 12px;
    cursor: pointer;
    text-align: left;
    transition:
      background 0.2s ease,
      border-color 0.2s ease,
      transform 0.15s ease,
      box-shadow 0.2s ease;
    width: 100%;
    font: inherit;
    color: inherit;
  }

  .project-tile:hover {
    background: var(--card-bg-hover);
    border-color: var(--accent-primary, #667eea);
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  }

  .project-tile:active {
    transform: translateY(0);
  }

  .tile-icon {
    font-size: 4rem;
    line-height: 1;
    margin-bottom: 0.3rem;
    user-select: none;
  }

  .tile-icon-img {
    width: 14rem;
    height: 14rem;
    object-fit: contain;
    display: block;
  }

  .tile-icon-component {
    width: 14rem;
    height: 14rem;
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
