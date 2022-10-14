# FSM (@peter.naydenov/fsm)

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
- Transition function could contain asynchronous code(Available after version 2.0); 
- Chain-actions in **transaction conditions** (Optional after version 2.0);
- Chain-actions are possible on **positive** and *negative* transition-end (After version 2.0);
- Export fsm state as an object: externalState. (Available after version 2.1);
- Import externalState (Available after version 2.1);
- Prevent simultaneous updates (Available after version 2.1);
- Cache stack for fsm-updates and postponed execution (Available after version 2.1);





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

Execution of transition function will end on `task.done(end)` where **end** is an **transitionResult** object. 





## transitionResult
Only one of the params in this object is required:
 
 ```js
  { 
      success : true   // Required. Boolean. Transition success;
    , response : {}    // Optional. Object. update answer response;
    , stateData : {}   // Optional. Object. 'stateData' if there is stateData changes; 
    , command : null   // Optional. String|null|undefined. Next action if chaining is required (depricated). Use "chainActions" in table instead;
   }
 ```



## FSM Methods

```js
   setDependencies     : 'Insert all external dependencies'
 , getState            : 'Returns actual state'
 , update              : 'Trigger an action'
 , exportState         : 'Export state and stateData as a single object (externalState)'
 , importState         : 'Import externalState object.'
 , reset               : 'Revert state and stateData to initial values described during initialization'
 , ignoreCachedUpdates : 'Ignore all cached updates'
```


### fsm.setDependencies ()
Set dependencies for FSM. Dependency object will be provided to every transition function. With **dependency injection** code will stay testable. Don't forget to add here all **window** based objects and functions that are available only in the browser environment.

```js
 const 
      moment = require ( 'moment' )
    , fsm = new Fsm ()
    , deps = {
              scrollTo : window.scrollTo
            , moment 
        }
    ;

  fsm.setDependencies ( deps )     
```
- **Method returns**: void;



### fsm.getState ()
Will return current current FSM state. 

```js
 let currentState = fsm.getState ()
```
- **Method returns**: string. Current FSM state;



### fsm.update ()
Provide actions to FSM. If conditions 'state/action' exist in description table, FSM will react.
```js
 fsm.update ( action, altData)
    .then ( r => {
             // ...do something with the response
        })
```
- **action**(required): string. The action.
- **altData**(optional): any. Additional data provided to the transition;
- **Method returns**: Promise of any. Returned value is equal to transitionResult.response;





### fsm.exportState ()
Export state and stateData as a single object (**externalState**). Export state to:
- Keep fsm history record;
- Possible point of recovery;
- Synchronize fsm states accross the network in large distributed systems;
- Debuging purposes;

```js
   const externalState = fsm.exportState ();
   /**
    *  externalState = {
    *                     state : 'actualState'
    *                   , stateData : {
    *                                   ... all stateData flags are here
    *                                }
    *               }
    * */
```

- **Method returns**: externalState object





### fsm.importState ()
Put fsm in specific state by importing **externalState** object described in 'exportState()' method. Use method to:
- Recover previous state of the fsm;
- Testing specific situations by moving fsm directly in required state;
- Synchronize fsm states accross the network;

- **externalState**: externalState object
- **Method returns**: void





### fsm.reset ()
Returns initial values for state and stateData.

```js
  fsm.reset ()
```
- **Method returns**: void;





### fsm.ignoreCachedUpdates ()
Ignore all cached updates.

```js
const fsm = new Fsm ( description, transitions );
fsm.update ( 'start' ).then ( x =>  fsm.ignoreCachedUpdates () ) 
/** 
 *  Update with action 'start' will block all upcoming updates. Subsequent updates
 *  will wait by using cache mechanism.
 *  Method 'ignoreCachedUpdates' will remove updates from cache and will close their promises with 'reject' and
 *  error message.
 *  Use reject function to customize 'canceled updates' behaviour
 */
fsm.update ( 'move' )
    .then ( r => {   // resolve function
                result = fsm.exportState ()
                expect ( result.state ).to.be.equal ( 'initial' )
              }
            , r => {   // reject function
                //---> 'r' will contain error message produced by fsm.
                //  r == "Action 'move' was ignored"
            })
```

- **Method returns**: void;





## Example

Example represents controller for system that require electricity. On `fsm.update('start')` controller will try to activate standard electricity source. On fail will trigger chain-action `generator` and will try to activate alternative energy source. On success state will become `altSrc`(alternativeSource). When standart electricity source is available we can inform the system by calling `fsm.update('electricity')` and on success state will become `active`. Switch off the system any time by calling `fsm.update('stop')`.

```js
const 
        lib   = {  
                    switchON ( task, dependencies, stateData, dt ) {
                            task.done ({ success : false })
                        }
                    , altOn ( task ) {
                            task.done ({ success: true })
                        }
                    , switchOFF ( task ) {
                            task.done ({ success: true })
                        }
                    , primarySource ( task ) {
                            task.done ({ success: true })
                        }
            }
    , machine = {
                      init  :  'none'
                    , table : [
                                [ 'none'   , 'start'      , 'active' , 'switchON', [ false, 'generator']  ]
                              , [ 'none'   , 'generator'  , 'altSrc' , 'altOn'         ]
                              , [ 'active' , 'stop'       , 'none'   , 'switchOFF'     ]
                              , [ 'altSrc' , 'stop'       , 'none'   , 'switchOFF'     ]
                              , [ 'altSrc' , 'electricity' , 'active', 'primarySource' ]
                            ]
                }
    ;
const fsm = new Fsm ( machine, lib );
fsm.update ( 'activate' )
    .then ( () => {
                const r = fsm.getState ();
                expect ( r ).to.be.equal ( 'altSrc' )
            })

```





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



### Transition params
  
```js
    // ver. 1 ->
    transition ( dependencies, stateData, dt )

    // ver. 2 ->
    transition ( task, dependencies, stateData, dt )

```

- **Change**: Open transition library and add 'task' argument to all transitioin functions.



### Description table
- **Version 1**: Transition condition in description table:
    ```js
        [ 'state', 'action', 'nextState', 'transitionFx' ]
    ```
    All fields are string and are required.

- **Version 2**: Fields in description table record:
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

- **Changes**: As ChainActions is an optional parameter, no changes needed.



### Chaining
- Version 1:
    TransitionResult should contain property "command", that will link to next transition.
- Version 2:
    TransitionResult with property 'command' still works. Chaining in description-table is more powerfull and will overwrite transitionResult's "command" property.
- Changes: No changes needed but is much better to describe chains in description table instead in transition functions. Keep all logic flows on one place for easy reading and manipulating.





## Release History

### 3.0.0 (2022-10-14)
- [x] Dependency "@peter.naydenov/walk" was upgraded to version 3.0.0;

### 2.2.4 ( 2022-05-27 )
- [x] New dependency was added - walk ("@peter.naydenov/walk");
- [x] "Walk" is loaded by default in fsm dependency object;
- [x] "Ask-for-promise" is loaded by default in fsm dependency object;
- [x] Deep copy for stateData on each update with "walk" library;

### 2.2.3 ( 2021-04-02 )
- [x] Fix: Duplicated update callback if logic contain a chainAction;

### 2.2.2 ( 2021-03-26 )
- [x] Internal code refactoring; 
- [ ] Bug: Duplicated update callback if logic contain a chainAction;



### 2.2.0 (2019-01-20)
- [x] Fix: Cached transitions are starting before callback functions for already executed transitions;
- [x] New method 'ignoreCachedUpdates()'. Ignore all cached updates;

### 2.1.0 (2019-01-19)
- [x] Export fsm state as an object - externalState;
- [x] Import externalState;
- [x] Lock updates during update process execution;
- [x] Prevent simultaneous updates;
- [x] Cache new updates during update process execution;
- [x] Execute cached updates in a row;
- [ ] Error: Cached transitions are starting before callback functions for already executed transitions;

### 2.0.0 (2018-12-01)
- [x] Transition function could contain asynchronous code;
- [x] Chain-actions in **transaction conditions** (Optional);
- [x] Chain-actions are possible on **positive** and *negative* transition-end;

### 1.0.0 (2018-11-21)
- [x] FSM;
- [x] Set FSM external dependencies;
- [x] Chain-actions by using `command` in transition response object;
- [x] Internal state flags and values with stateData;





## Credits
'@peter.naydenov/fsm' was created by Peter Naydenov.






## License
'@peter.naydenov/fsm' is released under the MIT License.


