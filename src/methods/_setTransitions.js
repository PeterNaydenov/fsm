function _setTransitions () {
return function ( behavior, lib ) {   // ( machineTable, transitionLib ) --> {transitions, nextState, chainActions}
     // *** Converts initial FSM data to useful fsm objects.
                let 
                       transitions = {}
                     , nextState = {}
                     , chainActions = {}
                     ;
                behavior.forEach ( line => {
                        const 
                              [ from, action, next, transitionName, alt ] = line
                            , transition = lib [ transitionName ]
                            , key = `${from}/${action}`
                            ;
                        transitions[key] = transition || null
                        nextState  [key] = next
                        if ( _isAltValid(alt) ) {  
                                chainActions [key] = []
                                chainActions [key][0] = alt[0]
                                chainActions [key][1] = alt[1]
                           }
                   })
                return { transitions, nextState, chainActions }
 }} // _setTransitions func.





function _isAltValid ( alt ) {   //   (altAction) -> boolean
// *** Check if alt is valid altAction.
// *** An altAction must be a 2-element array of [positive, negative] chain
// *** actions, where each element is either a string (the action name) or
// *** the literal `false` (no chain for that branch). See README "chaining"
// *** and the `behavior` row shape in the FSM definition.
            if ( !(alt instanceof Array) )   return false
            if ( alt.length != 2         )   return false
            return alt.every ( m => m === false || typeof m === 'string' )
  } // _isAltValid func.
       


export default _setTransitions


