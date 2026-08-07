# Ecosystem covenant map

This map distinguishes operational dependency, conformance, proposal flow, embodiment, and ancestry. It is not an instruction to merge repositories or flatten sovereign domains.

The machine-readable source is [`registry/projects.json`](../registry/projects.json). A relation must be explicit there before tooling treats it as real.

## Five kinds of living node

| Stratum | Question | Current nodes |
| --- | --- | --- |
| Constitutional substrate | How does something remain itself and prove continuity? | Project0, TranchNode |
| Shared protocol | Which transition machinery has actually repeated across domains? | Jubilee Authority Kit (seed-stage) |
| Domain kernels | What transitions are lawful in this particular world? | Haunted Toaster, Band Runtime, Idea Grove, Full Measure, convergent-codec |
| Proposal and discovery | What might be built, admitted, or tried? | Toaster Lab, Toaster Oracle, SeedForge, SEAMforge, Founder Node |
| Embodiments | Where can a person inhabit the law? | Corpus OS, Groove Rooms, Formation Trace, Autodisco, Circle, Gramfork, reCOreturn |

Ancestors and concept donors remain visible in the registry without being represented as runtime dependencies.

## The central metabolism

```text
intent / encounter / source
  → proposal
  → domain admission
  → lawful transition
  → addressed artifact + receipt
  → projection / return / replay
```

No project owns that entire passage.

- Proposal systems preserve possibility.
- Domain kernels preserve lawful difference.
- Project0 preserves identity.
- TranchNode preserves durable continuity and fulfillment.
- Embodiments make the system inhabitable.
- Experiment systems make claims replayable and falsifiable.

## Current executable braid

```text
Toaster Oracle → Toaster Lab → Haunted Toaster
                 proposes       validates/resolves/renders

Groove Rooms → Band Runtime
  embodies       encounter law

Corpus OS → TranchNode → Project0
 embodiment   custody      canonical identity
```

These are typed relationships, not poetic proximity. The first uses `PROPOSES_TO`; the second uses `EMBODIES`; the third uses `DEPENDS_ON` and `CONFORMS_TO`.

## Relation vocabulary

| Relation | Meaning |
| --- | --- |
| `DEPENDS_ON` | Operationally requires another project. |
| `CONFORMS_TO` | Implements a contract without necessarily importing it. |
| `PROPOSES_TO` | Supplies candidates without admission authority. |
| `RECORDS_IN` | Persists artifacts or receipts through another system. |
| `PROJECTS_FROM` | Builds a disposable view from canonical residue. |
| `EMBODIES` | Turns a kernel into an inhabited product. |
| `DESCENDS_FROM` | Records direct code or product lineage. |
| `DONATES_PATTERN_TO` | Contributes a concept without creating a runtime dependency. |
| `EXPERIMENTS_ON` | Measures or attempts to falsify a target contract. |
| `EXPORTS_TO` | Makes an explicit bounded transfer between sovereign systems. |

Therefore:

```text
influenced by ≠ depends on
shares a pattern with ≠ must import
descends from ≠ should merge
proposes to ≠ has authority over
```

## Authority Kit placement

The kit is not a third constitutional kernel between Project0/TranchNode and every product. It is a seed-stage extraction site for transition shapes proven in more than one domain.

It may own framework-neutral command envelopes, deterministic admission outcomes, refusal receipts, replay, and adversarial fixtures. It may not own domain ontology, canonical identity, artifact custody, or automatic authority over adopters.

## Registry rules

1. Every registered project states what it owns and what it does not own.
2. Every edge names one of the ten relation types.
3. Every edge target must resolve to a registered project.
4. Unknown projects stay `unresolved`; uncertainty is represented rather than guessed away.
5. `DONATES_PATTERN_TO` and `DESCENDS_FROM` never imply an import.
6. A proposed future integration is not recorded as an active edge until code, contract, or an accepted decision makes it real.

## Immediate use

- SEAMforge can read the registry and propose missing seams without declaring them canonical.
- Founder Node can route intent toward the project that owns the relevant transition.
- CI can later reject dangling targets, duplicate IDs, and illegal dependency direction.
- Humans can inspect the lineage field without mistaking ancestry for current coordination.
