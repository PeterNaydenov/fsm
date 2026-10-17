## Migration Guides


## Migration from v.5.x.x to v.6.x.x.
The machine API (definition, transitions, methods, events) is the same. Changes come from dt-toolbox 8 and the CommonJS types. Most projects upgrade without code changes.

### Built-in `walk` dependency
`dependencies.walk` and `Fsm.dependencies.walk` are now `@peter.naydenov/walk` v7. If a callback returns `IGNORE`, call it:

```js
// ver. 5 ->
    walk ({ data, keyCallback ({ value, IGNORE }) { if ( value == null ) return IGNORE; return value } })
// ver. 6 ->
    walk ({ data, keyCallback ({ value, IGNORE }) { if ( value == null ) return IGNORE (); return value } })
```

### Built-in `dtbox` dependency
`dependencies.dtbox` is dt-toolbox 8:
- `dtbox.init ( data, { model } )` with an unknown model throws an error. Before, it returned `null`;
- `dt.copy ()` returns keys in the same order as `model(() => ({as:'std'}))`: plain values first, then nested objects. Values are the same;
- See the dt-toolbox [Changelog](https://github.com/PeterNaydenov/dt-toolbox/blob/master/Changelog.md) for the full list.

### Snapshots with Date and RegExp values
Snapshots from `exportState()` keep Date and RegExp values as they are. When you pass a snapshot in memory, `importState()` restores them as before. JSON can't keep these values: after `JSON.stringify`, a Date comes back as an ISO string and a RegExp as `{}`. If you store snapshots as JSON and need Date objects back, convert them after `JSON.parse`, or keep dates in state data as ISO strings. Snapshots exported by version 5 still import correctly.

### CommonJS and TypeScript
CommonJS types now use `export =`, the same as the runtime `module.exports = Fsm`:

```ts
// CommonJS (.cts, or "module": "commonjs")
import Fsm = require ( '@peter.naydenov/fsm' )
const definition: Fsm.FsmDefinition = { init: 'idle', behavior: [] }

// with "esModuleInterop" (the default for "module": "nodenext"), a default import also works
import Fsm from '@peter.naydenov/fsm'
```
- Remove any `require('@peter.naydenov/fsm').default`. It was `undefined` at runtime;
- With `"moduleResolution": "node10"` and no `esModuleInterop`, use `import Fsm = require(...)`;
- ES modules and bundlers keep `import Fsm, { type FsmDefinition } from '@peter.naydenov/fsm'`.

### Debug mode
`debug: true` sets `globalThis.debugFSM`. In Node.js, `global.debugFSM` is the same object. Debug mode now works in browsers too.



## Migration from v.4.x.x to v.5.x.x.

### FSM Description
- FSM description property 'table' was renamed to `behavior`;
- Data fields for stateData should be in fsm machine definition. Missing keys will be ignored;

### Transition functions
- Transition functions have different set and arrangment of arguments;

```js
 // ver. 4 ->
    function transitionFunction ( task, dependencies, stateData, data ) {
        // ...code here
        return task.done(transitionResult);
    }
// ver. 5 ->
    // stateData is not directly available. Use the function extractList to get the data you need;
    // look at the example below:
    function transitionFunction ( {task, state, dependencies, extractList }, data ) {
        // ...code here
        const [ top, something, else ] = extractList ([ 'a', 'b', 'c' ]);
        // get 'a' from stateData and write in variable 'top';
        // get 'b' from stateData and write in variable 'something';
        // get 'c' from stateData and write in variable 'else';
        const transitionResult = { 
                                      success : true
                                    , stateData : { 
                                                        // ...setup stateData changes here
                                                } 
                                    , result : 
                            };
        task.done(transitionResult);
    }

```
- Transition functions can update only defined stateData fields. Not defined data-segments or properties will be ignored;
```js
 const machine = {
                    behavior : [
                                    // transition condition rows here..
                            ]
                    stateData : {
                                    a : 1 // <- this is the only allowed field in stateData;
                                }
            }

 const lib = {
            trans ({task}) { // transition function
                    stateData = { a : 2, b : 3, c : 4 }; // <- only 'a' is defined in machine.stateData;
                    task.done({ success : true, stateData }) // 'b' and 'c' will be ignored;
                }
        }
```
- If you don't know what is defined in stateData, just request a extractList without any arguments;
```
function trans ({task, extractList}) {
    const stateDataCopy = extractList(); // <- will return state fields from stateData wrapped in object    
}
```
- Fill stateData with primitive values and objects that are JSON compatible!


## Migration from v.1 to v.2
Project was started with simplest posible implementation. I like the approach and want to extend it. Reasons:
- Some of my transition function contain asynchronous events; 
- Describe chain of actions inside the transition condition records;
- Chain of action on positive and negative transition end;

So... about changes:
### Transition complete
- **Version 1**: Transition function should return **transitionResult** object.
- **Version 2**: Transition function receives as first param **task**. Task is askForPromise object. Transition is complete on `task.done(transitionResult)`.
- **Changes**: Find return statement and convert it to task.done:

```js
    // ver. 1 ->
    ...
    return { success : true }
    // ver. 2 ->
    ...
    task.done ({ success : true })

```