#@peter.naydenov/fsm

Finite state machine(FSM) is an abstract machine that can be in exactly one of a finite number of **states** at any given time. The FSM can change from one state to another in response to some external inputs(**actions**). The change from state to another is called a **transition**. An FSM is defined by a list of its states, its initial state, and the conditions for each transition.
```js
const myFsm = {
          init  : 'none'  // initial fsm state
        , table : [     
                    // [ fromState,  action   , nextState, transitionFx ]
                       [ 'none'   , 'activate', 'active' , 'switchON'   ] // transition condition
                    ,  [ 'active' , 'stop'    , 'none'   , 'switchOFF'  ] // transition condition
                 ]
    }
```
- **init**: string. Initial state for the FSM;
- **table**: array of transitionConditions. Describe relation among fsm state, action and transition;
- **transitionCondition**: Array [fromState action nextState transitionFx];
- **fromState**: string. State as starting point for transition;
- **action**: string. External input signal. Transition could happen only when fromState and action are described in transitionCondition record;
- **nextState**: string. The FSM state if transition is successful;
- **transitionFx**: string. The function name that will be executed on 'state/action' conditions. Transition should return **transitionResult** object where parameter "**success**" will represent transition success. Result of transition will be evaluated by FSM. Positive response will change actual state to 'nextState' from transitionCondition record. Negative result will keep actual state;

**Transitions** are functions and they are provided to FSM as functional library - javascript object with functions.
```js
const transitionLibrary = {
          switchOn  : function () {
                        // ...code 
                      }
        , switchOff : function () {
                        // ...code
                      }
    }
```

It's simple and clean way to represent system behaviour but practice shows that is not enough. This implementation was extended to cover some aditional program needs like:
- Transition function could contain asynchronous code; 
- Transition chaining inside the description table (Optional);
- Chain on positive and negative exit from the transition;

These features are available after version 2 of the library.




## Implement Fsm

Install module by:
```
npm i @peter.naydenov/fsm
```

Add in your script:

```js
 const Fsm = require ( '@peter.naydenov/fsm' )
 // init new fsm:
 const fsm = new Fsm ( machine, lib )
```
... where **machine** is fsm-description and **lib** is a transition-library.


## Fsm Description
Fsm description is an object that define fsm business logic. Every fsm description should contain **init** and **table** properties.:
```js
const machine = {
        init : 'stopped'
      , table: [
                //    [  state   , action    , nextState, functionName, chainAction(optional) ]
                      [ 'stopped', 'activate', 'active', 'fnActivate' ]
                    , [ 'stopped', 'activate', 'active', 'fnActivate' ]
                ]
      , stateData : { greeting: 'hi' }
      /** Parameter 'stateData' is optional parameter. Data will be 
       *  provided to each transition function. You can read and modify
       *  stateData values.
       * /
      }
```

Property '**init**' is the initial state of the system. Property '**table**' describes how system reacts. Every row contain 5 elements:
 1. Current active state;
 2. Action;
 3. Next state;
 4. Transition function that should be applied;
 5. Chain action
 
 ```js
 [ 'stopped', 'activate', 'active', 'fnActivate' ]
 // Read this transition condition like:
 /**
  *  When state is 'stopped' and external input 'activate' comes, transition 'fnActivate' will be executed. On success state will become 'active'. No chain-actions are defined.
  */
 ```

## Fsm Transition Library

Object that will contain all transition functions:
```js
 const lib = {
       fnActicate () { 
           // ... code to activate
       }
     , fnStop () {
          // ... code to stop
       }
 }
```

 ## Fsm Transition Function

 Fsm transition function is a function, member of transition library. Transition functions is kind of middleware. Every function receives 4 arguments:
 ```js
const lib = {
  fnActivate ( task, dependencies, stateObject, dt ) {
       // function code is here...
       task.done ( end )   // end is a transitionResult {}
    }
}
 ```
 - task         - askForPromise object; [AskForPromise documentation](https://github.com/PeterNaydenov/ask-for-promise). Represents asynchronous transition execution. Finish by providing to task object, the transition result object. `task.done( transitionResult )`;
 - dependencies - object. Contain all external dependencies. Set fsm dependencies by fsm.setDependencies(); 
 - stateObject  - object. Contains all helper params needed to support the FSM state;
 - dt           - object. External data provided from fsm.update( action, **dt**);

Execution of transition function will end on `task.done(end)` where **end** is an **transitionResult** object. Only one of the params in this object is required:
 
 ```js
  { 
      success : true   // Required. Boolean. Transition success;
    , command : null   // Optional. String|null|undefined. Next action if chaining is required;
    , response : {}    // Optional. Object. update answer response;
    , stateData : {}   // Optional. Object. 'stateData' if there is stateData changes; 
   }
 ```





## Migration from v.1 to v.2
Project was started with simplest posible implementation. I like the approach and want to extend it. Reasons:
- Some of my transition function contain asynchronous events; 
- Create chains of transitions inside the description table;
- Chain on positive and negative exit from the transition;

So... about changes:
### Transition complete
- Version 1: Transition function should return **transitionResult** object.
- Version 2: Transition function receives as first param **task**. Task is askForPromise object. Transition is complete on `task.done(transitionResult)`.
- Changes: Find return statement and convert it to task.done:

```js
    // before ->
    ...
    return { success : true }
    // now ->
    ...
    task.done ({ success : true })

```



### Transition params
  
```js
    // before ->
    transition ( dependencies, stateData, dt )

    // now ->
    transition ( task, dependencies, stateData, dt )

```

- Change: Open transition library and add 'task' argument to all transitioin functions.



### Description table
- Version 1: Transition condition in description table:
    ```js
        [ 'state', 'action', 'nextState', 'transitionFx' ]
    ```
    All fields are string and are required.

- Version 2: Fields in description table record:
    ```js
        [ 'state', 'action', 'nextState', 'transitionFx', 'chainActions' ]
        // chainAction is array [ nextAction, nextAction ]
        // If we need chaining only on positive/negative result of transition we can use "false"
        // Example:
        // We need chain transition only if transition failed:
        // [ false, nextAction ]
        // This chainAction will trigger nextAction only if transition failed.

    ```
  ChainActions is an array with two values. First value represents next action on success transition. 
  Second on failed transition. ChainAction is optional.

- Changes: As ChainActions is an optional parameter, no changes needed.



### Chaining
- Version 1:
    TransitionResult should contain property "command", that will link to next transition.
- Version 2:
    TransitionResult with property 'command' still works. Chaining in description-table is more powerfull and will overwrite transitionResult's "command" property.
- Changes: No changes needed but is much better to describe chains in description table instead in transition functions. Keep all logic flows on one place for easy reading and manipulating.


