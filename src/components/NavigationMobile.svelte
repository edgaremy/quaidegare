<script>
  import { route } from "@mateothegreat/svelte5-router";
  import { Menu, X } from "@lucide/svelte";
  import ThemeToggle from "./ThemeToggle.svelte";
  import ERBlack from "../assets/ER_black_small.svg";

  let isMenuOpen = $state(false);
  let isScrolled = $state(false);
  let isNavVisible = $state(true);
  let lastScrollY = $state(0);
  let touchStartX = $state(0);
  let touchCurrentX = $state(0);
  let isDragging = $state(false);
  let menuOffset = $state(0);
  let enableTransition = $state(true);

  $effect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        const currentScrollY = window.scrollY;
        isScrolled = currentScrollY > 50;

        // Auto-hide/show behavior when scrolled
        if (isScrolled) {
          if (currentScrollY > lastScrollY) {
            // Scrolling down - hide nav
            isNavVisible = false;
          } else {
            // Scrolling up - show nav
            isNavVisible = true;
          }
        } else {
          // Always show when at top
          isNavVisible = true;
        }

        lastScrollY = currentScrollY;
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  });

  // Lock/unlock body scroll when menu opens/closes
  $effect(() => {
    if (typeof document !== "undefined") {
      if (isMenuOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  });

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    enableTransition = true;
  }

  function closeMenu() {
    isMenuOpen = false;
    menuOffset = 0;
    enableTransition = true;
  }

  function handleNavigation() {
    closeMenu();
  }

  function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    isDragging = true;
    enableTransition = false; // Disable transition during drag
  }

  function handleTouchMove(event) {
    if (!isDragging) return;
    
    touchCurrentX = event.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartX;
    
    // Only allow swipe to the right (closing)
    if (deltaX > 0) {
      menuOffset = deltaX;
    }
  }

  function handleTouchEnd() {
    if (!isDragging) return;
    isDragging = false;
    enableTransition = true; // Re-enable transition for snap animation
    
    // Close menu if swiped more than 30% of screen width
    if (menuOffset > window.innerWidth * 0.3) {
      isMenuOpen = false;
      // Wait for transition, then reset offset
      setTimeout(() => {
        menuOffset = 0;
      }, 400);
    } else {
      // Snap back to open position
      menuOffset = 0;
    }
  }
</script>

<nav class="navbar" class:scrolled={isScrolled} class:hidden={!isNavVisible}>
  <div class="nav-container">
    <a href="/" use:route class="nav-logo-link">
      <img src={ERBlack} alt="ER Logo" class="nav-logo" />
    </a>

    <button
      class="hamburger-menu"
      onclick={toggleMenu}
      aria-label="Toggle menu"
    >
      <Menu size={28} strokeWidth={2.2} />
    </button>
  </div>
</nav>

<!-- Full-screen menu overlay -->
<nav
  class="menu-overlay" 
  class:active={isMenuOpen}
  class:no-transition={!enableTransition}
  style="transform: translateX({menuOffset}px);"
  ontouchstart={handleTouchStart}
  ontouchmove={handleTouchMove}
  ontouchend={handleTouchEnd}
  aria-label="Mobile menu"
>
  <button
    class="close-button"
    onclick={closeMenu}
    aria-label="Close menu"
  >
    <X size={28} strokeWidth={2.2} />
  </button>

  <nav class="menu-content">
    <ul class="menu-list">
      <li>
        <a href="/" use:route onclick={handleNavigation}>Home</a>
      </li>
      <li>
        <a href="/projects" use:route onclick={handleNavigation}>Projects</a>
      </li>
      <li>
        <a href="/research" use:route onclick={handleNavigation}>Research</a>
      </li>
      <li>
        <a href="/contact" use:route onclick={handleNavigation}>Contact</a>
      </li>
    </ul>

    <div class="theme-toggle-wrapper">
      <ThemeToggle />
    </div>
  </nav>
</nav>

<style>
  .navbar {
    background: transparent;
    position: sticky;
    top: 0;
    z-index: 50;
    transition: background-color 0.1s ease, transform 0.3s ease;
    margin-top: 1rem;
    transform: translateY(0);
  }

  .navbar.scrolled {
    background: var(--nav-bg);
    border-bottom: 1px solid var(--nav-border);
    backdrop-filter: blur(20px) saturate(250%);
    -webkit-backdrop-filter: blur(20px) saturate(250%);
    z-index: 100;
  }

  .navbar.hidden {
    transform: translateY(-100%);
  }

  .nav-container {
    max-width: 100%;
    margin: 0;
    padding: 0.4rem 1.2rem 0.4rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .nav-logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
  }

  .nav-logo {
    height: 25px;
    width: auto;
    user-select: none;
    -webkit-user-drag: none;
  }

  :global([data-theme="light"]) .nav-logo,
  :global(:root:not([data-theme="dark"])) .nav-logo {
    filter: invert(5%) sepia(47%) saturate(1358%) hue-rotate(338deg)
      brightness(93%) contrast(92%);
  }

  :global([data-theme="dark"]) .nav-logo {
    filter: invert(100%) sepia(1%) saturate(7487%) hue-rotate(312deg)
      brightness(93%) contrast(118%);
  }

  .hamburger-menu {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 101;
    color: var(--text-primary);
    transition: transform 0.1s ease;
  }

  .hamburger-menu:active {
    transform: scaleX(1.15) scaleY(0.9);
  }

  .menu-overlay {
    position: fixed;
    top: 0;
    right: -100%;
    width: 100%;
    height: 100vh;
    background: var(--nav-bg);
    backdrop-filter: blur(20px) saturate(250%);
    -webkit-backdrop-filter: blur(20px) saturate(250%);
    border-left: 1px solid var(--nav-border);
    z-index: 100;
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
    touch-action: pan-x;
  }

  .menu-overlay.active {
    right: +1px;
  }

  .menu-overlay.no-transition {
    transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0s;
  }

  .close-button {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 101;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.1s ease;
  }

  .close-button:active {
    transform: scaleX(1.15) scaleY(0.9);
  }

  .menu-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 2rem;
  }

  .menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    text-align: center;
  }

  .menu-list a {
    font-family: "Young Serif", serif;
    font-size: 2.5rem;
    font-weight: 600;
    color: var(--text-primary);
    text-decoration: none;
    transition: opacity 0.3s ease;
    letter-spacing: -0.03em;
  }

  .menu-list a:hover {
    opacity: 0.7;
  }

  .theme-toggle-wrapper {
    position: absolute;
    bottom: 4rem;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
