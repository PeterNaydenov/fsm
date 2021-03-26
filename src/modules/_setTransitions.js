function _setTransitions () {
return function ( table, lib ) {   // ( machineTable, transitionLib ) --> {transitions, nextState, chainActions}
     // *** Converts initial FSM data to useful fsm objects.
                let 
                       transitions = {}
                     , nextState = {}
                     , chainActions = {}
                     ;
                table.forEach ( el => {
                        const 
                              [ from, action, next, transitionName, alt ] = el
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
            if ( !(alt instanceof Array) )   return false
            if ( alt.length != 2         )   return false
            alt.forEach ( m => {
                            if ( m !== false ||  typeof m != 'string' )    return false
                    })
            return true
  } // _isAltValid func.
       


module.exports  = _setTransitions        


