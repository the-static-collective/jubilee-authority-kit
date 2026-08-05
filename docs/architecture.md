# Architecture

## The narrow problem

A generated application often starts with direct mutable tables. That is fine for a sketch, but it becomes dangerous when the application starts claiming that its state is accountable, shared, or authoritative. The kit supplies the boundary that turns a requested action into one of three clear outcomes:

```
command → deterministic admission → immutable receipt → disposable projections
                          ↘ refusal receipt (semantic effect: none)
```

The ledger is the source of truth. Tables, caches, realtime state, and interface views are projections from it.

## Core vocabulary

| Term | Meaning |
| --- | --- |
| Command | A requested state transition, bound to actor, scope, causal head, and idempotency key. |
| Admission | Deterministic evaluation of a command against policy and durable history. |
| Receipt | Immutable residue stating the attempted command, outcome, references, and resulting causal position. |
| Refusal proof | Receipt for a prohibited or invalid attempt; it preserves the attempt without granting its intended semantic effect. |
| Projection | Recomputable view derived from receipts; never a source of canonical mutation. |
| Local artifact | Private work that remains owned and mutable locally until its author expressly offers an export. |
| Authority scope | The bounded actions and objects an actor may affect. A delegate may not enlarge it. |

## Contract shape (v0)

```ts
type CommandEnvelope<Intent> = {
  commandId: string;
  idempotencyKey: string;
  actor: ActorRef;
  scope: ScopeRef;
  expectedHead: ReceiptRef;
  submittedAt: string; // canonical UTC instant
  intent: Intent;
};

type Admission =
  | { outcome: "admitted"; receipt: Receipt }
  | { outcome: "conflicted"; refusal: RefusalReceipt }
  | { outcome: "refused"; refusal: RefusalReceipt };

type Receipt = {
  receiptId: string;
  commandId: string;
  parent: ReceiptRef;
  actor: ActorRef;
  scope: ScopeRef;
  outcome: "admitted";
  semanticEffect: "applied";
  occurredAt: string;
  payload: unknown;
};

type RefusalReceipt = Omit<Receipt, "outcome" | "semanticEffect"> & {
  outcome: "conflicted" | "refused";
  semanticEffect: "none";
  rule: string;
  protectedStateBefore: string;
  protectedStateAfter: string; // equal to before
};
```

The precise IDs and canonical encoding should inherit Project0’s addressing rules (JCS, UTC `Z`, unsafe-integer rejection, bounded depth) rather than invent a second standard.

## Admission order

1. Canonicalize and validate the envelope.
2. Verify the actor and scope binding.
3. Resolve the current causal head.
4. Check idempotency.
5. Compare the expected head.
6. Evaluate domain policy and authority.
7. Append exactly one admitted or refusal receipt.
8. Update materialized projections only after the append commits.

There is no temporary “looks admitted” projection between steps 6 and 7.

## Refusal and protected silence

When an action is forbidden, the kit preserves an attributable record of the attempt. It does not perform a partial mutation, create a hidden side effect, or silently erase the event. A protected object may also declare silence: no anticipation, recognition, or derived expansion may be applied to it without the explicitly required bridge or offer.

## The projection covenant

A receiver may create local residue, but may not enlarge a testimony’s disclosure, authority, or claimed scope.

This separates citation, republication, adoption, inference, and delegation. Each may be valid in a particular domain, but none should be accidentally smuggled through a generic “context” or sync layer.
