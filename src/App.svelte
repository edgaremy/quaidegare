<script>
  import { Router } from "@mateothegreat/svelte5-router";
  import Navigation from "./components/Navigation.svelte";
  import Home from "./routes/Home.svelte";
  import Research from "./routes/Research.svelte";
  import Projects from "./routes/Projects.svelte";

  const routes = [
    { path: "/", component: Home },
    { path: "/research", component: Research },
    { path: "/projects", component: Projects },
    { path: "/contact", component: Home },
  ];
</script>

<main>
  <Navigation />

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
