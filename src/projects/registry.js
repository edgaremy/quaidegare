/**
 * Project registry — powered by Vite's import.meta.glob().
 *
 * To add a new project:
 *   1. Create a folder  src/projects/<your-slug>/
 *   2. Add a            src/projects/<your-slug>/metadata.js  (see existing ones for shape)
 *   3. Add a            src/projects/<your-slug>/Page.svelte   (your project content)
 *   4. Done — the project appears automatically in the grid, sorted by date.
 */

const metadataModules = import.meta.glob('./*/metadata.js', { eager: true });
const pageModules     = import.meta.glob('./*/Page.svelte',  { eager: true });

function buildProjects() {
  return Object.entries(metadataModules).map(([path, mod]) => {
    const slug    = path.split('/')[1]; // "dummy-alpha" from "./dummy-alpha/metadata.js"
    const pageKey = `./${slug}/Page.svelte`;
    return {
      ...mod.metadata,
      slug,
      component: pageModules[pageKey]?.default ?? null,
    };
  }).sort((a, b) => new Date(b.date) - new Date(a.date)); // newest first
}

export const allProjects = buildProjects();

/** Returns projects grouped by year, newest year first. */
export function getProjectsByYear() {
  const map = {};
  for (const project of allProjects) {
    const year = new Date(project.date).getFullYear().toString();
    if (!map[year]) map[year] = [];
    map[year].push(project);
  }
  return Object.entries(map)
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, projects]) => ({ year: Number(year), projects }));
}

/** Returns a single project by slug, or undefined. */
export function getProjectBySlug(slug) {
  return allProjects.find(p => p.slug === slug);
}
