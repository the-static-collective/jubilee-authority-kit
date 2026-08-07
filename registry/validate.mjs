import { readFile } from "node:fs/promises";

const registry = JSON.parse(await readFile(new URL("./projects.json", import.meta.url), "utf8"));
const allowed = new Set(registry.relationTypes);
const ids = new Set();
const repos = new Set();
const errors = [];

for (const project of registry.projects) {
  if (ids.has(project.id)) errors.push(`duplicate project id: ${project.id}`);
  if (repos.has(project.repository)) errors.push(`duplicate repository: ${project.repository}`);
  ids.add(project.id);
  repos.add(project.repository);
}

for (const project of registry.projects) {
  for (const relation of project.relations) {
    if (!allowed.has(relation.type)) errors.push(`${project.id}: unknown relation ${relation.type}`);
    if (!ids.has(relation.target)) errors.push(`${project.id}: dangling target ${relation.target}`);
    if (relation.target === project.id) errors.push(`${project.id}: self relation ${relation.type}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`registry valid: ${registry.projects.length} projects`);
}
