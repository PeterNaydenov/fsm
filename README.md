#@peter.naydenov/fsm

// TODO: Documentation is not complete...

Finite state machine implementation.

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
Start using it by providing fsm description:
```js
const machine = {
        init : 'stopped'
      , table: [
                      [ 'stopped', 'activate', 'active', 'fnActivate ]
                    , [ 'stopped', 'activate', 'active', 'fnActivate ]
                ]
      , stateData : { greeting: 'hi' }
      /** Parameter 'stateData' is optional parameter. Data will be 
       *  provided to each transition function. You can read and modify
       *  stateData values.
       * /
      }
```

Property '**init**' is the initial state of the system. Property '**table**' describes how system reacts. Every row contain 4 elements:
 1. Current active state;
 2. Action;
 3. Next state;
 4. Transition function that should be applied;
 
 ```js
 [ 'stopped', 'activate', 'active', 'fnActivate ]
 /**
  *  State is 'stopped'. On success execution of a 'activate' action state will become 'active'. Transition is described in function 'fnActivate'.
  */
 ```

## Fsm Transition Library

Create an object that will contain all transition functions:
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
 Fsm transition function is a function, member of transition library. Transition functions should return an object answer like
 ```js
  { 
      success : true   // Transition success. Boolean. Required;
    , command : null   // Next action if chaining is required. String|null|undefined. Optional;
    , response : {}   // update answer response. Object. Optional
    , stateData : {}  // stateData if there is stateData changes. Object.Optional; 
   }
 ```

```js
 // example for transition function
 function () {
       // ... do something here
       return { success : true } // means - transition is confirmed
    }
 ```