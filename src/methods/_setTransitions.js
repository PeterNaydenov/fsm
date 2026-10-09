/**
 * Create the behavior-table compiler. This factory does not need machine storage.
 * @private
 * @returns {(behavior: Array<import('../main.js').BehaviorRow>, lib: import('../main.js').TransitionLibrary) => import('../main.js').TransitionTables} Bound compiler.
 */
function _setTransitions () {
/**
 * Compile state/action rows into transition, destination-state, and chaining tables.
 * Unresolved library names become null; malformed chaining pairs are ignored.
 * @private
 * @param {Array<import('../main.js').BehaviorRow>} behavior - Machine behavior table.
 * @param {import('../main.js').TransitionLibrary} lib - Transition functions by name.
 * @returns {import('../main.js').TransitionTables} Lookup tables for update processing.
 */
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





/**
 * Validate a two-element positive/negative chaining pair.
 * @private
 * @param {*} alt - Candidate chaining configuration.
 * @returns {boolean} Whether both entries are strings or the literal false.
 */
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


