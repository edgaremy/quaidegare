<script>
  import { route } from "@mateothegreat/svelte5-router";
  import ThemeToggle from "./ThemeToggle.svelte";
  import NavigationButton from "./NavigationButton.svelte";
  import { theme } from "../stores/theme.js";
  import ERBlack from "../assets/ER_black_small.svg";

  let isMenuOpen = $state(false);
  let isScrolled = $state(false);
  let currentTheme = $state($theme);

  $effect(() => {
    currentTheme = $theme;
  });

  $effect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        isScrolled = window.scrollY > 50;
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function closeMenu() {
    isMenuOpen = false;
  }
</script>

<nav class="navbar" class:scrolled={isScrolled}>
  <div class="nav-container">
    <div class="logo-wrapper">
      <a href="/" use:route class="nav-logo-link" class:visible={isScrolled}>
        <img src={ERBlack} alt="ER Logo" class="nav-logo" />
        <span class="nav-logo-name">Edgar Remy</span>
      </a>
    </div>

    <button class="menu-toggle" onclick={toggleMenu} aria-label="Toggle menu">
      <span class:open={isMenuOpen}></span>
      <span class:open={isMenuOpen}></span>
      <span class:open={isMenuOpen}></span>
    </button>

    <ul class="nav-menu" class:active={isMenuOpen}>
      <li>
        <NavigationButton href="/" label="Home" onClick={closeMenu} />
      </li>
      <li>
        <NavigationButton
          href="/projects"
          label="Projects"
          onClick={closeMenu}
        />
      </li>
      <li>
        <NavigationButton
          href="/research"
          label="Research"
          onClick={closeMenu}
        />
      </li>
      <li>
        <NavigationButton href="/contact" label="Contact" onClick={closeMenu} />
      </li>
    </ul>

    <ThemeToggle />
  </div>
</nav>

<style>
  .navbar {
    background: transparent;
    box-shadow: none;
    position: sticky;
    top: 0;
    z-index: 50;
    transition: background-color 0.1s ease;
    margin-top: 1rem;
  }

  .navbar.scrolled {
    background: var(--nav-bg);
    border-bottom: 1px solid var(--nav-border);
    backdrop-filter: blur(20px) saturate(250%);
    -webkit-backdrop-filter: blur(20px) saturate(250%);
    z-index: 100;
    transition:
      background-color 0.3s ease,
      z-index 0s;
  }

  .nav-container {
    max-width: 100%;
    margin: 0;
    padding: 0.5rem 2rem;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    grid-column: 1;
  }

  .nav-logo-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    opacity: 0;
    transform: translateX(-20px);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
    pointer-events: none;
  }

  .nav-logo-link.visible {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }

  .nav-logo {
    height: 26px;
    width: auto;
    user-select: none;
    -webkit-user-drag: none;
    display: flex;
    align-items: center;
    /* transform: scaleY(0.9); */
  }

  /* Apply dark brown filter to black SVG in light theme */
  :global([data-theme="light"]) .nav-logo,
  :global(:root:not([data-theme="dark"])) .nav-logo {
    filter: invert(5%) sepia(47%) saturate(1358%) hue-rotate(338deg)
      brightness(93%) contrast(92%);
  }

  /* Apply creamy tint to white logo in dark theme */
  :global([data-theme="dark"]) .nav-logo {
    filter: invert(100%) sepia(1%) saturate(7487%) hue-rotate(312deg)
      brightness(93%) contrast(118%);
  }

  .nav-logo-name {
    font-family: "Young Serif", serif;
    font-size: 1.7rem;
    font-weight: 600;
    letter-spacing: -0.06em;
    color: var(--text-primary);
    text-decoration: none;
    opacity: 0;
    max-width: 0;
    overflow: hidden;
    white-space: nowrap;
    transition:
      opacity 0.3s ease,
      max-width 0.3s ease;
    display: flex;
    align-items: center;
    margin-top: 2px;
  }

  .nav-logo-link:hover .nav-logo-name {
    opacity: 1;
    max-width: 200px;
  }

  .menu-toggle {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }

  .menu-toggle span {
    width: 25px;
    height: 3px;
    background: var(--text-primary);
    margin: 3px 0;
    transition: all 0.3s ease;
    border-radius: 3px;
  }

  .menu-toggle span.open:nth-child(1) {
    transform: rotate(45deg) translate(7px, 7px);
  }

  .menu-toggle span.open:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle span.open:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }

  .nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;
    grid-column: 2;
    justify-content: center;
    font-size: 1.2rem;
    z-index: 3;
  }

  .nav-menu + :global(*) {
    grid-column: 3;
    justify-self: end;
  }

  @media (max-width: 768px) {
    .menu-toggle {
      display: flex;
    }

    .nav-menu {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--nav-bg);
      flex-direction: column;
      gap: 0;
      padding: 1rem 0;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .nav-menu.active {
      max-height: 300px;
    }

    .nav-menu li {
      text-align: center;
    }

    .nav-logo {
      height: 28px;
    }
  }
</style>
