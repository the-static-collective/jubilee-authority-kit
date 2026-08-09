# Jubilee Authority Kit

A framework-neutral authority boundary for systems that need durable, explainable transitions without confusing an interface, a model suggestion, or a projection with canonical state.

> Models propose. Deterministic admission decides. Durable receipts witness what happened. Projections remain disposable.

This repository is intentionally **not** a new app or runtime. It is the shared seam extracted from working domain experiments: the parts that should behave the same whether the surface is mutual aid, a listening room, a private idea grove, or a local formation instrument.

## What belongs here

- command envelopes: actor, intent, scope, expected head, idempotency key
- deterministic admission outcomes
- append-only receipt shapes, including refusal proof
- replay and idempotency fixtures
- projection boundaries: a view may derive from a receipt stream; it cannot become authority
- integration guidance for domain adapters
- a descriptive, typed ecosystem registry that distinguishes execution edges from lineage and concept donation
- a federated invariant index that points from a proven claim to its owning repository and executable evidence

## What does not

- domain ontology (needs, songs, ideas, permissions specific to one application)
- UI state, realtime transport, or audio/media implementation
- mutable collaboration tables used as a shortcut for command authority
- “AI decides” logic
- universal authority over the projects named in the registry
- ownership of the laws indexed in `registry/invariants.json`

## Laws

1. **No transition without a receipt.** Durable state changes are represented by immutable, attributable residue.
2. **An actor cannot enlarge received authority.** Delegation and projection stay within their declared scope.
3. **The expected head matters.** A command is admitted against a known causal state or is explicitly rejected/conflicted.
4. **Idempotency is evidence, not convenience.** Replaying the same command returns the same receipt, never a duplicate transition.
5. **Refusal is first-class.** A prohibited attempt may append proof that it was refused, with `semanticEffect: "none"`; it may not modify protected state.
6. **Projections are not the ledger.** Realtime, synthesis, UI, and search can fail or be recomputed without changing history.
7. **Local formation stays local until offered.** A private trace becomes shared only through an explicit, signed export artifact.

## Registry status semantics

`projects.json.status` is **descriptive activity/lifecycle metadata**, not authority and not a permission bit. Consumers must not infer that `active` grants execution authority or that `dormant` revokes a declared capability. `kind`, `owns`, `nonAuthority`, and typed `relations` remain the stronger routing/authority declarations.

- `active` — materially in current development or operation;
- `seed` — an early shared seam/specification under active discovery, not yet a mature common authority surface;
- `dormant` — retained and potentially useful, but not currently being developed or operated;
- `ancestor` — historical direct lineage retained for provenance, not current implementation authority;
- `monument` — intentionally closed historical form retained as evidence/donor material;
- `unresolved` — inventoried but not sufficiently inspected to classify safely.

A project may carry paired `statusReviewedAt` + `statusBasis` fields. They state **when and why that descriptive status was last reviewed**. Freshness is advisory evidence only: it never manufactures repository authority, silently disables routing, or overrides explicit ownership/non-authority declarations.

## First proving grounds

| Consumer | Uses the kit for | Keeps local |
| --- | --- | --- |
| `gramfork` | command/replay/idempotency/receipt/RLS patterns | mutual-aid needs, circles, verified stages |
| `groove-rooms` | refusal and projection boundaries | rooms, invitations, media, playback |
| `formation-trace` | signed export boundary | private editing trace and deletion/privacy policy |
| `jubilee-workspace` / `idea-grove` | read/propose-only interfaces | grove vocabulary and visual surface |
| `fork-EXCLAIM` | optional exported proposal seam | its standalone creative product logic |

Read [the architecture](docs/architecture.md), [the ecosystem covenant map](docs/adoption-map.md), [the machine-readable project registry](registry/projects.json), [the federated invariant index](registry/invariants.json), and [the first implementation slice](docs/first-slice.md).

Validate project identity, typed edges, invariant ownership/proof references, authority overlaps, unowned capability signals, status-review metadata, and the operational living-marrow view with:

```bash
node registry/validate.mjs
```

## Status

Seed specification. Both registries are descriptive and grant no authority. `projects.json` records declared ecosystem roles; `invariants.json` records discovered law only after proof and always points back to the repository that owns that law.
