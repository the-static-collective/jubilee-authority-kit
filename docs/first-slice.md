# First implementation slice

Build the smallest package that can prove the laws. Do not start with a database SDK, a UI component library, or a generic workflow engine.

## Deliverable

`@static/jubilee-authority-kit`

- `src/command.ts` — typed command envelope and canonical validation hooks
- `src/admit.ts` — pure admission function
- `src/receipt.ts` — admitted and refusal receipt discriminated unions
- `src/replay.ts` — deterministic replay / projection reducer helpers
- `src/projection-covenant.ts` — disclosure and receivable-as checks
- `test/fixtures/` — serializable canonical scenarios

## Required fixture set

| Fixture | Expected result |
| --- | --- |
| Exact replay | Same idempotency key returns the original receipt; sequence does not advance. |
| Stale expected head | A refusal/conflict receipt with `semanticEffect: "none"`; protected state hash stays identical. |
| Scope enlargement | Delegated command is refused when it reaches beyond declared authority. |
| Cross-scope testimony | Requires an explicit bridge receipt; attribution does not become authority. |
| Protected silence | Recognition / anticipation attempt is refused and preserved as residue. |
| Projection restart | Rebuild from receipts yields the same projection; clearing a cache changes nothing durable. |
| Local export | A local formation artifact is unreadable to the shared runtime until an explicit export contract is offered. |

## Acceptance rules

- Pure admission is deterministic: identical history plus identical command yields identical outcome.
- All admission paths append a receipt or return an existing idempotent receipt.
- A refusal receipt has `semanticEffect: "none"` and identical protected before/after fingerprints.
- No reducer may infer authority from a projection, a model response, or a client-controlled status field.
- Fixtures run in TypeScript and Python against the same serialized input before declaring v0 stable.

## First adopter

Start in Gramfork with one narrow command: a member offers a need or contribution within a circle. Wire only that command through expected-head, idempotency, append, and read projection. When the fixtures pass there, adapt Groove Rooms’ contribution event—not the other way around.

## Explicitly defer

- billing and funds movement
- general-purpose authorization language
- realtime transport
- AI synthesis
- automatic “trust” scores
- cross-repository event bus

The point is to establish one honest transition path, then reuse it.
