# FSM 5.x API

## Configuration and transitions

```js
new Fsm({
    init: 'idle',
    behavior: [
        ['idle', 'start', 'active', 'start', [false, 'fallback']]
    ],
    stateData: {count: 0},
    stateDataFormat: {as: 'std'}
}, transitionLibrary)
```

`behavior` is required and may be empty. A missing or falsy `init` becomes `'N/A'`. The constructor returns the public method object, not the internal machine storage.

Each row contains a current state, action, next state, transition-library key, and optional pair of chain actions. The pair must contain exactly two values, each an action-name string or `false`; malformed pairs are ignored. Empty strings do not dispatch an action. For duplicate state/action keys, the last row selects the function and destination, while the last valid chaining pair is retained. Prefer unique keys to avoid this ambiguity.

Transitions receive `({task, state, extractList, dependencies}, data)`:

- `state` is the state before this step.
- `data` is the input to `update()`, or the preceding step's response in a chain.
- `extractList` reads current state data.
- `dependencies` contains built-ins and injected application services.
- `task.done(result)` completes the transition. Its return value is ignored.

The result is `{success: boolean, stateData?: patch, response?: any}`. On success, the configured destination state is applied before callbacks and any positive chain. On failure, the state is retained and the negative chain, if configured, runs from that state. Each chained step receives the preceding response.

An async function still needs to call `task.done()`. Catch expected operational failures and return a negative result with useful response data. Neither a rejected async return nor `task.cancel()` provides the normal negative-result workflow; an unsettled parent update can leave the queue blocked.

## Public methods

| Method | Contract |
| --- | --- |
| `update(action, data?)` | Returns a promise of the final transition response. Busy machines queue actions in arrival order and evaluate them against the state when execution begins. |
| `getState()` | Returns the current state string. |
| `extractList(names, options?)` | Returns values in request order, with `null` for missing values. An empty list returns an empty list. |
| `extractList()` | Returns all joined state data as a standard JavaScript object. |
| `setDependencies(deps)` | Shallow-merges dependencies into a new container. Supplied keys can replace built-ins. Returns void. |
| `getDependencies()` | Returns the live dependency container, not a copy. |
| `on(event, callback)` | Appends a synchronous `(state, response)` handler. Returns void. |
| `off(event)` | Removes all handlers for that event. Returns void. |
| `exportState()` | Returns `{state, stateData}` with data in dt-toolbox model form. |
| `importState(snapshot)` | Sets a truthy state and merges optional model data into existing fields. Falsy state ignores the whole import. Returns void. |
| `reset()` | Restores the original state and data. Returns void. |
| `ignoreCachedUpdates()` | Cancels queued updates, retaining the active update. Each canceled promise rejects with `Action '<action>' was ignored`. Returns void. |

An unknown state/action pair or missing transition function completes an unsuccessful step. Outcome callbacks and configured failure chaining still apply; without a chain, the response is `undefined`. Do not interpret promise resolution as proof of success.

## State data and formats

Declare every top-level field that transitions will update in initial `stateData`. Patches may be plain objects, dt-toolbox models, or dt-toolbox objects; new top-level keys are ignored and patches apply only on success.

For list extraction, `options` is an object such as `{as: 'std'}`, `{as: 'tuples'}`, `{as: 'dt-model'}`, or `{as: 'dt-object'}`. Omitted or false options use the machine's `stateDataFormat`, defaulting to `{as: 'std'}`. Modeling applies to object segments; primitive values are returned directly. An unsupported format may throw through dt-toolbox.

## Events and queue lifecycle

The supported events are `positive`, `negative`, `transition`, and `update`:

1. Apply the step's successful state/data changes, if any.
2. Run either `positive` or `negative` handlers, then `transition` handlers.
3. Execute the selected chain, or settle the update with the final response.
4. Run `update` handlers once for the completed chain, then release the lock and begin the next queued update.

Handlers receive the state after processing the result and the response. Within each event, handlers run in registration order. Unsupported event names are ignored. Callback return values are ignored; keep required asynchronous work inside a transition instead of assuming an async listener delays the queue. Thrown callbacks can interrupt completion, so handle expected callback failures where appropriate.

Attach rejection handling to queued updates that may be canceled. `ignoreCachedUpdates()` does not abort the active task. Neither `reset()` nor `importState()` emits events, clears the queue, or waits for active work; active or queued transitions can subsequently alter restored values.

## Snapshots

```js
const snapshot = machine.exportState()
machine.importState(snapshot)
```

`snapshot.stateData` is an array of dt-toolbox model rows, not the plain object returned by `extractList()`. Pass the exported model back unchanged when restoring a snapshot. Import merges only fields declared by the receiving machine; it does not replace its definition, dependencies, callbacks, or queue. Unknown truthy state names are accepted, so verify that the imported state is useful for the application's behavior table.

## Dependencies, debugging, and TypeScript

Built-ins are `walk`, `dtbox`, `askForPromise`, and `query` with `splitSegments`, `joinSegments`, and `updateState`. Inject application services with `setDependencies()`; access them through the transition's `dependencies`. `Fsm.dependencies` exposes static built-in references; assigning it does not configure an instance.

`debug: true` logs missing transition functions and exposes internal storage as `global.debugFSM` in environments providing `global`. Use it only when inspecting internals is needed; normal application code should use public methods.

The package exports declarations generated from source JSDoc. Import the default constructor normally; named types such as `FsmDefinition`, `TransitionLibrary`, and `TransitionResult` are available as type-only imports. In the library repository, `npm run build:types` generates declarations and `npm run test:types` validates consumer usage. Confirm availability when working with an older installed package.
