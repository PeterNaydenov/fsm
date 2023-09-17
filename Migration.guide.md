## Migration Guides


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