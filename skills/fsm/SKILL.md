---
name: fsm
description: Builds and debugs finite state machines using @peter.naydenov/fsm. Applies when a task uses this package or requests its behavior tables, asynchronous transitions, success/failure action chains, state data, update queues, snapshots, or TypeScript integration. Targets this library rather than unrelated FSM implementations.
---

# FSM

Implement the requested machine with `@peter.naydenov/fsm`, preserving the application's state names, actions, and integration choices.

## Workflow

1. Inspect the existing machine, transition library, and installed package version. The bundled references describe the 5.x API; use the installed source or JSDoc to resolve version differences.
2. Identify the initial state, input actions, destination states, and data fields. Express each rule as `[fromState, action, nextState, transitionName, optionalChain]`; provide the named function in the transition library.
3. Predeclare state-data fields in the configuration. Read them through `extractList()` and update them through successful transition results.
4. Complete every transition path with `task.done({success, stateData?, response?})`. For asynchronous work, catch expected failures and complete with `success: false` so the update can finish and failure chains can run.
5. Verify observable states, responses, and data for the relevant success, failure, and queued-action paths. An awaited update alone does not establish that its transition succeeded.

## Minimal pattern

```js
import Fsm from '@peter.naydenov/fsm'

const machine = new Fsm({
    init: 'idle',
    behavior: [['idle', 'start', 'running', 'start']],
    stateData: {count: 0}
}, {
    start({task, extractList}, input) {
        const [count] = extractList(['count'])
        task.done({
            success: true,
            stateData: {count: count + 1},
            response: input
        })
    }
})

const response = await machine.update('start', {source: 'button'})
```

## Contracts that affect implementation

- Returning a value or promise from a transition does not complete it. A transition that never completes can block later updates. `task.cancel()` is not a substitute for a negative transition result; step rejection does not settle the parent update.
- An unsuccessful transition retains the current state and ignores its state-data patch. Chain actions use `[positiveAction, negativeAction]`, with `false` disabling a branch. Chained actions receive the previous response and run against the resulting current state.
- `update()` resolves with the final step's response, which may be `undefined`. Unknown state/action pairs and missing transition functions produce negative outcomes rather than rejected update promises.
- State-data patches update existing top-level fields; they do not add new fields. `extractList(['field'])` returns an ordered array, while `extractList()` returns all data as a standard object.
- Updates arriving while the machine is busy are queued. Resetting or importing state does not cancel active or queued work. Event-handler return values are ignored, and asynchronous handlers are not awaited.

## Read details as needed

- Read [references/api.md](references/api.md) for exact method contracts, event order, state-data formats, snapshots, and debugging.
- Read [references/examples.md](references/examples.md) for complete asynchronous, fallback-chain, and queue-cancellation examples with expected results.

## Working on the library itself

Keep JSDoc in `src/` as the type source; generate declarations instead of editing `dist/types/` by hand. Run the applicable checks from the repository root:

```sh
npm test
npm run test:types
npm run build
```

For consumer projects, use their existing test and build commands. Check state and response behavior without relying on private helpers or the debug global.
