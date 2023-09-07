## Release History

### 5.0.0 (2023-09-20... )
- [x] All default dependencies are available on top level: Fsm.dependencies;
- [x] stateData is a dt-object;
- [x] Transition functions have different arrangment of arguments;
- [x] Transition functions can receive multiple data arguments(single is still the preference);
- [x] Transition functions can update only defined stateData; // TODO: Describe it better
- [x] Method `exportState` will return an object with two properties: `state` and `stateData`. `state` is a string. `stateData` is a dt-model. Method `importState` expect exact same object as argument;
- [x] Result.command was removed permanently from the code;
- [x] New method: `getStateData` returns a list of requested stateData properties;
- [x] Internal fsm data is hidden. Only public methods are available;
- [x] TODO: Here are new methods that I should look `_setStateData`, '_updateStateData', getStateData;




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


