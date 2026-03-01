<script>
  import { goto } from "@mateothegreat/svelte5-router";
  const { href = "#", label = "", onClick = null } = $props();

  function handleClick(event) {
    event.preventDefault();
    // If onClick returns true the navigation is fully handled by the caller
    const handled = onClick ? onClick(event) : false;
    if (!handled) goto(href);
  }
</script>

<button
  class="nav-btn"
  onclick={handleClick}
  type="button"
>
  {label}
</button>

<style>
  .nav-btn {
    background: none;
    border: none;
    color: var(--nav-text);
    font: inherit;
    font-weight: 300;
    padding: 0.4rem 0.9rem;
    border-radius: 6px;
    cursor: pointer;
    transition:
      color 0.4s ease,
      transform 0.1s;
  }
  .nav-btn:hover {
    color: var(--accent-primary);
    background: var(--accent-hover);
    /* font-weight: 600;
    letter-spacing: -0.012em; */
  }
  .nav-btn:active {
    transform: scaleY(0.9) scaleX(1.1);
    outline: none;
  }

</style>
