<script>
  import { onMount } from "svelte";
  import { theme } from "../stores/theme.js";
  import ERstrokes from "../assets/ER_strokes_only_animated.svg";
  import ERBlack from "../assets/ER_nostrokes.svg";
  import CirclesGradient from "../effects/CirclesGradient.svelte";
  import RaysGradient from "../effects/RaysGradient.svelte";
  import ProjectTile from "../components/ProjectTile.svelte";
  import { getProjectsByYear } from "../projects/registry.js";

  const projectsByYear = getProjectsByYear();

  let currentTheme = $state($theme);
  let isLoaded = $state(false);
  // Changing svgKey forces the <img> to reload the SVG file and restart its animation.
  let svgKey = $state(0);

  $effect(() => {
    currentTheme = $theme;
  });

  onMount(() => {
    // ── URL sync: grab the pre-patch native replaceState ──────────────────
    // The router monkey-patches history.replaceState and fires a "replaceState"
    // event on every call, which would cause a full re-render of the same route.
    // We stored the native method in main.js (before mount) to bypass this.
    // Because of this, scrolling between / and /projects never triggers a remount,
    // so onMount only runs on genuine navigations — it is safe to always animate.
    const rawReplaceState = window._nativeReplaceState ?? history.replaceState.bind(history);

    // ── SVG animation — always play on every real mount ───────────────────
    svgKey = Date.now(); // unique key restarts the animated SVG
    const animTimer = setTimeout(() => {
      isLoaded = true;
    }, 200);

    // ── Scroll to projects section if this mount was triggered by /projects ─
    const projectsSection = document.getElementById("projects");
    if (
      projectsSection &&
      (window.location.pathname === "/projects" ||
        window.location.hash === "#projects")
    ) {
      requestAnimationFrame(() => {
        projectsSection.scrollIntoView({ behavior: "smooth" });
      });
    }

    // ── URL ↔ scroll sync ─────────────────────────────────────────────────
    // threshold: 0 fires the observer as soon as ANY pixel of the section
    // enters or leaves the viewport — reliable even on slow scrolling.
    // We use boundingClientRect.top to distinguish:
    //   - section NOT intersecting + top > 0  → section is BELOW viewport → show "/"
    //   - section NOT intersecting + top < 0  → section scrolled ABOVE   → still "/projects"
    let observer;
    if (projectsSection && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              rawReplaceState(null, "", "/projects");
            } else if (entry.boundingClientRect.top > 0) {
              // Projects section is below the viewport — we are on the hero
              rawReplaceState(null, "", "/");
            }
            // If top < 0 and not intersecting we are deep inside/past the
            // section — keep the URL as /projects (do nothing).
          });
        },
        { threshold: 0 }
      );
      observer.observe(projectsSection);
    }

    return () => {
      clearTimeout(animTimer);
      observer?.disconnect();
    };
  });
</script>

<div class="background-gradient">
  {#if currentTheme === "dark"}
    <RaysGradient />
  {:else}
    <CirclesGradient />
  {/if}
</div>

<div class="home-container">
  <div class="logo-section" class:loaded={isLoaded}>
    <div class="logo-stack">
      <div
        class="logo-wrapper animated-logo"
        style="width:89.5%;max-width:800px;position:absolute;top:0;left:3.8%;z-index:2;"
      >
        <img
          key={svgKey}
          src={`${ERstrokes}?v=${svgKey}`}
          alt="Animated Edgar Remy Logo"
          class="main-logo animated-svg"
        />
      </div>
      <div
        class="logo-wrapper static-logo"
        style="position:relative;z-index:1;"
      >
        <img src={ERBlack} alt="Edgar Remy Logo" class="main-logo" />
      </div>
    </div>
    <h1 class="name" class:visible={isLoaded}>Edgar Remy</h1>
  </div>
</div>

<!-- ─── Projects section ───────────────────────────────────────────────────── -->
<section id="projects" class="projects-section">
  <h2 class="projects-heading">Projects</h2>

  {#each projectsByYear as { year, projects }}
    <div class="year-group">
      <h3 class="year-label">{year}</h3>
      <div class="projects-grid">
        {#each projects as project (project.slug)}
          <ProjectTile
            title={project.title}
            subtitle={project.subtitle}
            icon={project.icon}
            iconComponent={project.iconComponent}
            slug={project.slug}
            hoverBgLight={project.hoverBgLight}
            hoverBgDark={project.hoverBgDark}
            hoverTextLight={project.hoverTextLight}
            hoverTextDark={project.hoverTextDark}
          />
        {/each}
      </div>
    </div>
  {/each}
</section>

<style>
  .background-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    min-height: 100%;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  /* Ensure the background gradient stretches to the full scrollable height if content is taller than viewport */
  :global(body) {
    min-height: 100vh;
    position: relative;
  }

  :global(html) {
    min-height: 100vh;
  }

  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 95vh;
    padding: 2rem;
    position: relative;
    z-index: 10;
  }

  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: transform 1s cubic-bezier(0.2, 0, 0.2, 1);
    z-index: 3;
  }

  /* When loaded, shift up to accommodate the name */
  .logo-section.loaded {
    transform: translateY(-2.5rem);
  }

  .logo-stack {
    position: relative;
    width: 100%;
    max-width: 800px;
    height: auto;
    min-height: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .logo-wrapper {
    width: 100%;
    max-width: 800px;
    height: auto;
  }
  .animated-logo {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }
  .static-logo {
    position: relative;
    z-index: 1;
  }

  /* Glow effect container for dark theme */
  :global([data-theme="dark"]) .static-logo::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("../assets/ER_nostrokes.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    filter: invert(100%) sepia(20%) saturate(1620%) hue-rotate(293deg)
      brightness(101%) contrast(109%) blur(5px) brightness(1.5);
    opacity: 0;
    z-index: -1;
    pointer-events: none;
    animation: glow-fade-in 1.5s ease-out 2s forwards;
  }

  :global([data-theme="dark"]) .animated-logo::before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url("../assets/ER_strokes_only_animated.svg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    filter: invert(100%) sepia(20%) saturate(1620%) hue-rotate(293deg)
      brightness(101%) contrast(109%) blur(6px) brightness(300%);
    opacity: 0;
    z-index: -1;
    pointer-events: none;
    animation: glow-anim-fade-in 1.5s ease-out 2s forwards;
  }

  .main-logo {
    width: 100%;
    max-width: 800px;
    height: auto;
    transition: transform 0.3s ease;
    user-select: none;
    -webkit-user-drag: none;
    pointer-events: none;
    filter: brightness(0) saturate(100%);
  }

  :global([data-theme="light"]) .main-logo,
  :global(:root:not([data-theme="dark"])) .main-logo {
    filter: invert(5%) sepia(48%) saturate(1112%) hue-rotate(334deg)
      brightness(92%) contrast(92%);
  }

  :global([data-theme="dark"]) .main-logo {
    filter: invert(100%) sepia(20%) saturate(1620%) hue-rotate(293deg)
      brightness(101%) contrast(109%);
  }

  .name {
    font-family: "Young Serif", serif;
    font-size: 3.6rem;
    font-weight: 600;
    font-optical-sizing: auto;
    text-align: center;
    letter-spacing: -0.07em;
    transition:
      opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
      max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    width: 500px;
    max-width: 100%;
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    margin-top: 0.5rem;
    color: var(--text-primary);
  }

  :global([data-theme="dark"]) .name.visible {
    text-shadow: 0 0 20px rgba(255, 255, 255, 0);
    animation: text-glow-fade-in 1.5s ease-out 1.5s forwards;
  }

  .name.visible {
    opacity: 1;
    max-height: 150px;
  }

  @keyframes glow-fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.5;
    }
  }

  @keyframes glow-anim-fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.75;
    }
  }

  @keyframes text-glow-fade-in {
    0% {
      text-shadow: 0 0 8px rgba(255, 255, 255, 0);
    }
    100% {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.55);
    }
  }

  @media (max-width: 768px) {
    .main-logo {
      max-width: 300px;
    }

    .name {
      font-size: 3rem;
      width: 300px;
    }
  }

  @media (max-width: 480px) {
    .main-logo {
      max-width: 250px;
    }

    .name {
      font-size: 2.5rem;
      width: 250px;
    }
  }

  /* ─── Projects section ──────────────────────────────────────────────────── */
  .projects-section {
    position: relative;
    z-index: 10;
    max-width: 960px;
    margin: 0 auto;
    padding: 5rem 2rem 5rem;
  }

  .projects-heading {
    font-family: "Young Serif", serif;
    font-size: 3.2rem;
    font-weight: 600;
    letter-spacing: -0.04em;
    color: var(--text-primary);
    margin-bottom: 1rem;
    text-align: left;
  }

  .year-group {
    margin-bottom: 2.5rem;
  }

  .year-label {
    font-size: 1.75rem;
    font-weight: 300;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: var(--text-secondary, #888);
    margin-bottom: 1rem;
    text-align: left;
  }

  .projects-grid {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 1rem;
    margin-left: -1.6rem;
  }

  @media (max-width: 480px) {
    .projects-section {
      padding-left: 0;
      padding-right: 0;
    }

    .projects-heading {
      padding-left: 1.2rem;
    }

    .year-label {
      padding-left: 1.2rem;
    }

    .projects-grid {
      flex-direction: column;
      gap: 0;
      margin-left: 0;
    }
    /* On mobile each tile spans the full column */
    .projects-grid > :global(*) {
      width: 100%;
    }
  }
</style>
