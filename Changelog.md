## Release History


### 5.1.1 ( 2023-10-26)
- [x] Dependencies update: ask-for-promise@1.4.0;
- [x] Dependencies update: dt-toolbox@7.3.0;



### 5.0.0 ( 2023-09-16 )
- [x] Machine description `table` was renamed to `behavior`;
- [x] All default dependencies are available on top level: Fsm.dependencies;
- [x] stateData is a dt-object(uses dt-toolbox library);
- [x] Transition functions have different arrangement of arguments;
- [x] Transition functions can receive multiple data arguments(single is still the preference);
- [x] Transition functions can update only defined stateData fields. Not defined data-segments or properties will be ignored;
- [x] Method `exportState` returns an object with two properties: `state` and `stateData`. `state` is a string. `stateData` is a DT-model. Method `importState` expect exact same object as argument;
- [x] Method `importState` will filter the imported stateData to only predefined fields;
- [x] Transion result.command was removed permanently from the code. Was depricated in version 4;
- [x] Internal fsm data is hidden. Only public methods are available;
- [x] Changes in stateData can be provided as standard javascript object, DT-model or dt-object. Automatic detection is implemented;
- [x] Method `fsm.extractList` will return a list of requested stateData properties;
- [x] Method `extractList` is available as argument in transition functions.






### 4.0.1 ( 2022-11-16)
- [x] Walk was removed. Generates a lot of problems with objects in stateData(HTMLElement, Date, URL). StateData is using a shallow copy. Developer should take care of immutability himself;




### 4.0.0 (2022-11-15)
- [x] The library become a ES module;



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


