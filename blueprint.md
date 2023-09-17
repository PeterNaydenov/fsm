# Plans for the future



## Data validator
Simple data validator as an optional testing instrument. DT based as the stateData.





## Method 'explore'
- Question FSM for available states, actions, transitions, state/action pairs;
      -> list -> returns list of what is provided as second argument[ 'states', 'actions', 'state/action' ] 
      -> states: List of available states 
      -> transitions: Returns a function name for state/action name. If is not provided will return full list of possible action/ transition function
      -> actions: List of available actions from provided state. If is not provided will return full list of possible actions from current state;


      -> provide table of state/action -> transition -> resultState [ chainPositive, chainNegative] 
      -> ask for specific state -> provide list of possible actions;
      -> ask for specific action -> provide list of possible states;