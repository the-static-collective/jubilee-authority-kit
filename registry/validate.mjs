import { readFile } from "node:fs/promises";

const readJson = async (name) => JSON.parse(await readFile(new URL(name, import.meta.url), "utf8"));
const registry = await readJson("./projects.json");
const invariantRegistry = await readJson("./invariants.json");

const allowed = new Set(registry.relationTypes);
const ids = new Set();
const repos = new Set();
const projectById = new Map();
const projectByRepo = new Map();
const errors = [];
const warnings = [];

const normalize = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, " ").replace(/\s+/g, " ");
const nonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
const isoDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const capabilityMatches = (left, right) => {
  const a = normalize(left);
  const b = normalize(right);
  return a === b || (a.length >= 8 && b.includes(a)) || (b.length >= 8 && a.includes(b));
};

for (const project of registry.projects) {
  if (ids.has(project.id)) errors.push(`duplicate project id: ${project.id}`);
  if (repos.has(project.repository)) errors.push(`duplicate repository: ${project.repository}`);
  ids.add(project.id);
  repos.add(project.repository);
  projectById.set(project.id, project);
  projectByRepo.set(project.repository, project);

  const hasStatusReviewedAt = project.statusReviewedAt !== undefined;
  const hasStatusBasis = project.statusBasis !== undefined;
  if (hasStatusReviewedAt !== hasStatusBasis) {
    errors.push(`${project.id}: statusReviewedAt and statusBasis must be declared together`);
  }
  if (hasStatusReviewedAt && !isoDate(project.statusReviewedAt)) {
    errors.push(`${project.id}: invalid statusReviewedAt ${project.statusReviewedAt}`);
  }
  if (hasStatusBasis && !nonEmptyString(project.statusBasis)) {
    errors.push(`${project.id}: statusBasis must be a non-empty string`);
  }
}

for (const project of registry.projects) {
  for (const relation of project.relations) {
    if (!allowed.has(relation.type)) errors.push(`${project.id}: unknown relation ${relation.type}`);
    if (!ids.has(relation.target)) errors.push(`${project.id}: dangling target ${relation.target}`);
    if (relation.target === project.id) errors.push(`${project.id}: self relation ${relation.type}`);
  }
}

const invariantIds = new Set();
const allowedMaturity = new Set(["proven", "operational"]);

for (const invariant of invariantRegistry.invariants ?? []) {
  const prefix = `invariant ${invariant.id ?? "<missing-id>"}`;

  if (!nonEmptyString(invariant.id)) errors.push(`${prefix}: missing id`);
  if (invariantIds.has(invariant.id)) errors.push(`duplicate invariant id: ${invariant.id}`);
  invariantIds.add(invariant.id);

  for (const field of ["claim", "proof", "formalRule"]) {
    if (!nonEmptyString(invariant[field])) errors.push(`${prefix}: missing ${field}`);
  }

  if (!ids.has(invariant.owner)) {
    errors.push(`${prefix}: unknown owner ${invariant.owner}`);
  } else if (invariant.owner === "jubilee-authority-kit") {
    errors.push(`${prefix}: federated invariant index cannot make jubilee-authority-kit the law owner`);
  }

  if (!allowedMaturity.has(invariant.maturity)) {
    errors.push(`${prefix}: unsupported maturity ${invariant.maturity}`);
  }

  if (!Array.isArray(invariant.consumers)) {
    errors.push(`${prefix}: consumers must be an array`);
  } else {
    for (const consumer of invariant.consumers) {
      if (!ids.has(consumer)) errors.push(`${prefix}: unknown consumer ${consumer}`);
    }
  }

  if (!Array.isArray(invariant.counterexamples) || invariant.counterexamples.length === 0) {
    errors.push(`${prefix}: counterexamples must contain at least one falsifier`);
  } else if (invariant.counterexamples.some((item) => !nonEmptyString(item))) {
    errors.push(`${prefix}: counterexamples must be non-empty strings`);
  }

  if (!Array.isArray(invariant.proofRefs) || invariant.proofRefs.length === 0) {
    errors.push(`${prefix}: proofRefs must contain at least one reference`);
  } else {
    let ownerProof = false;
    for (const ref of invariant.proofRefs) {
      if (!projectByRepo.has(ref.repository)) {
        errors.push(`${prefix}: proof reference uses unregistered repository ${ref.repository}`);
      }
      if (projectById.get(invariant.owner)?.repository === ref.repository) ownerProof = true;
      if (!nonEmptyString(ref.type)) errors.push(`${prefix}: proof reference missing type`);
      if (ref.type === "pull_request" && (!Number.isInteger(ref.number) || ref.number <= 0)) {
        errors.push(`${prefix}: pull_request proof reference requires a positive integer number`);
      }
      if (ref.commit !== undefined && !/^[0-9a-f]{40}$/.test(ref.commit)) {
        errors.push(`${prefix}: invalid proof commit ${ref.commit}`);
      }
    }
    if (ids.has(invariant.owner) && !ownerProof) {
      errors.push(`${prefix}: proofRefs must include evidence from owner repository ${projectById.get(invariant.owner).repository}`);
    }
  }
}

const activeClaims = new Map();
for (const project of registry.projects.filter((item) => item.status === "active")) {
  for (const claim of project.owns) {
    const key = normalize(claim);
    const owners = activeClaims.get(key) ?? [];
    owners.push(project.id);
    activeClaims.set(key, owners);
  }
}

for (const [claim, owners] of activeClaims) {
  if (owners.length > 1) warnings.push(`duplicate active authority claim \"${claim}\": ${owners.join(", ")}`);
}

const activeOwnedCapabilities = registry.projects
  .filter((project) => project.status === "active")
  .flatMap((project) => project.owns.map((claim) => ({ project: project.id, claim })));

const unownedCapabilities = new Map();
for (const project of registry.projects) {
  for (const disclaimed of project.nonAuthority) {
    const owned = activeOwnedCapabilities.some(({ claim }) => capabilityMatches(disclaimed, claim));
    if (!owned) unownedCapabilities.set(normalize(disclaimed), disclaimed);
  }
}

const renderGroup = (label, projects) => {
  console.log(`\n${label} (${projects.length})`);
  for (const project of [...projects].sort((a, b) => a.id.localeCompare(b.id))) {
    console.log(`- ${project.id} [${project.kind}/${project.status}] — ${project.role}`);
  }
};

const activeExecution = registry.projects.filter((project) =>
  project.status === "active" && !["proposal-discovery", "concept-donor", "lineage-ancestor", "unresolved"].includes(project.kind)
);
const activeProposal = registry.projects.filter((project) => project.status === "active" && project.kind === "proposal-discovery");
const donors = registry.projects.filter((project) => project.kind === "concept-donor" && project.status !== "monument");
const ancestorsAndMonuments = registry.projects.filter((project) => project.kind === "lineage-ancestor" || ["ancestor", "monument"].includes(project.status));
const statusReviewed = registry.projects.filter((project) => project.statusReviewedAt && project.statusBasis);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else {
  console.log(`registry valid: ${registry.projects.length} projects, ${invariantRegistry.invariants.length} proven/operational invariants`);
}

if (warnings.length) {
  console.log(`\nauthority overlap report (${warnings.length})`);
  for (const warning of warnings) console.log(`- ${warning}`);
} else {
  console.log("\nauthority overlap report: no duplicate active authority claims");
}

const unowned = [...unownedCapabilities.values()].sort();
console.log(`\nunowned capability report: ${unowned.length} explicitly disclaimed capabilities have no matching active owner`);
for (const capability of unowned.slice(0, 12)) console.log(`- ${capability}`);
if (unowned.length > 12) console.log(`- ... ${unowned.length - 12} more`);

console.log(`\nstatus freshness report: ${statusReviewed.length}/${registry.projects.length} projects carry explicit status review evidence`);
for (const project of [...statusReviewed].sort((a, b) => a.id.localeCompare(b.id))) {
  console.log(`- ${project.id}: ${project.status} reviewed ${project.statusReviewedAt} — ${project.statusBasis}`);
}
console.log("- status metadata is advisory; kind/owns/nonAuthority/relations remain the stronger routing and authority declarations");

console.log("\n=== living marrow ===");
renderGroup("active execution", activeExecution);
renderGroup("active proposal", activeProposal);
renderGroup("donors", donors);
renderGroup("ancestors / monuments", ancestorsAndMonuments);
