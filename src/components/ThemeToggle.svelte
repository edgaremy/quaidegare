<script>
  import { theme } from "../stores/theme.js";
  import { Sun, Moon } from "@lucide/svelte";

  let currentTheme = $state($theme);

  $effect(() => {
    currentTheme = $theme;
  });

  function toggle() {
    theme.toggle();
  }
</script>

<button
  class="theme-toggle"
  onclick={toggle}
  aria-label={currentTheme === "dark"
    ? "Switch to light mode"
    : "Switch to dark mode"}
  title={currentTheme === "dark"
    ? "Switch to light mode"
    : "Switch to dark mode"}
>
  {#if currentTheme === "dark"}
    <Sun size={20} />
  {:else}
    <Moon size={20} />
  {/if}
</button>

<style>
  .theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px ridge var(--btn-border);
    border-radius: 50px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    color: var(--text-primary);
    transition: all 0.1s ease;
    margin-left: 1rem;
  }

  .theme-toggle:hover :global(svg) {
    animation: jumpAnimation 0.3s ease-out;
  }

  .theme-toggle:hover {
    background: var(--text-primary);
    color: var(--bg-primary);
  }

  .theme-toggle:active :global(svg){
    transform: scaleY(0.9) scaleX(1.15);
  }

  @keyframes jumpAnimation {
    0% {
      transform: translateY(-10px) scaleX(0.7) scaleY(1.1);
    }
    80% {
      transform: translateY(1px) scaleX(1.2) scaleY(0.95);
    }
    100% {
      transform: none;
    }
  }
</style>
