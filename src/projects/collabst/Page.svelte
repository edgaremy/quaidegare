<script>
  import ProjectPage from "../../components/ProjectPage.svelte";
  import { metadata } from "./metadata.js";
</script>

<ProjectPage {...metadata}>
  <!-- <h2>Overview</h2>
  <p>
    Project Alpha started as an internal experiment to unify the visual language across a suite
    of digital products. The core idea was simple: if every design decision can be expressed as
    a token — a named value — then changing the entire look of a product becomes a matter of
    swapping a single file.
  </p>

  <h2>Motivation</h2>
  <p>
    Most design systems grow organically and end up as collections of one-off decisions with no
    clear hierarchy. Alpha was designed top-down, starting with a strict set of primitives
    (colour, spacing, typography scale) before any component was considered.
  </p>

  <h2>Technical Approach</h2>
  <p>
    The system is distributed as a set of CSS custom properties generated from a JSON token file.
    A small build step (run with <code>npm run tokens</code>) converts the JSON into per-theme CSS
    files, a TypeScript types file, and a Figma-compatible tokens JSON.
  </p>

  <h2>Results</h2>
  <p>
    The first product to adopt Alpha went from design to production in three weeks — roughly
    half the time previously required. The token layer made it trivial to add a dark theme
    retroactively in a single afternoon.
  </p> -->
</ProjectPage>
