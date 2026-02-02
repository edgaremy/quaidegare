<script>
  import { Router } from "@mateothegreat/svelte5-router";
  import Navigation from "./components/Navigation.svelte";
  import NavigationMobile from "./components/NavigationMobile.svelte";
  import Home from "./routes/Home.svelte";
  import Research from "./routes/Research.svelte";
  import Projects from "./routes/Projects.svelte";

  let isMobile = $state(false);

  $effect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        const isNarrow = window.innerWidth <= 768;
        const orientation = window.screen?.orientation?.type;
        
        // Mobile if narrow width OR (portrait orientation OR no orientation API)
        // This prevents false positives on split desktop windows
        if (orientation) {
          isMobile = isNarrow || orientation.includes('portrait');
        } else {
          // Fallback: if no orientation API, use width only
          isMobile = isNarrow;
        }
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);
      window.screen?.orientation?.addEventListener("change", checkMobile);

      return () => {
        window.removeEventListener("resize", checkMobile);
        window.screen?.orientation?.removeEventListener("change", checkMobile);
      };
    }
  });

  const routes = [
    { path: "/", component: Home },
    { path: "/research", component: Research },
    { path: "/projects", component: Projects },
    { path: "/contact", component: Home },
  ];
</script>

<main>
  {#if isMobile}
    <NavigationMobile />
  {:else}
    <Navigation />
  {/if}

  <div class="router-container">
    <Router {routes} />
  </div>

  <footer>
    <p>© {new Date().getFullYear()} Edgar Remy.</p>
  </footer>
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .router-container {
    flex: 1;
    background: var(--bg-primary);
    padding: 1rem;
    transition: background-color 0.3s ease;
  }

  footer {
    text-align: center;
    padding: 2rem 0;
    margin-top: auto;
    color: var(--footer-text);
    font-size: 0.9rem;
    background: var(--bg-primary);
    transition: all 0.3s ease;
  }
</style>
