<!--
  ThemedIcon — renders an image with different CSS filters for light vs dark themes.

  Use this for any project logo that must be colourised differently per theme,
  instead of repeating the filter + theme-store wiring in every project folder.

  Props:
    src          — image URL (import your SVG/PNG asset and pass the resolved URL)
    lightFilter  — CSS filter() string applied in light mode
    darkFilter   — CSS filter() string applied in dark mode
    alt          — img alt text (default "")

  Sizing:
    The component fills its parent container (width: 100%; height: 100%).
    Constrain size by styling the parent wrapper.

  Example (inside a project's ERIcon.svelte):
    <ThemedIcon
      src={ERBlack}
      lightFilter="invert(5%) sepia(48%) saturate(1112%) hue-rotate(334deg) brightness(92%) contrast(92%)"
      darkFilter="invert(100%) sepia(20%) saturate(1620%) hue-rotate(293deg) brightness(101%) contrast(109%)"
      alt="My project logo"
    />

  ⚠ Do NOT add `transition: filter` — interpolating between unrelated filter chains
    produces red/pink intermediate hues. Theme switches are intentionally instant.
-->
<script>
  import { theme } from "../stores/theme.js";

  const { src, lightFilter, darkFilter, alt = "" } = $props();

  let currentTheme = $state($theme);
  $effect(() => {
    currentTheme = $theme;
  });
</script>

<img
  {src}
  {alt}
  class="themed-icon"
  style="--light-filter: {lightFilter}; --dark-filter: {darkFilter};"
  class:dark={currentTheme === "dark"}
  draggable="false"
/>

<style>
  .themed-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    filter: var(--light-filter);
    /* No transition: filter — see comment in component docs */
    pointer-events: none;
    user-select: none;
    -webkit-user-drag: none;
  }

  .themed-icon.dark {
    filter: var(--dark-filter);
  }
</style>
