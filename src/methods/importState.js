/**
 * Bind snapshot import to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(import('../main.js').ExternalState): void} Bound import method.
 */
function importState (fsm) {
/**
 * Set the state and merge an optional exported data model into existing fields.
 * A falsy state ignores the entire import; unknown truthy states are accepted.
 * Does not execute transitions, emit events, or clear pending updates.
 * @param {import('../main.js').ExternalState} snapshot - State and optional data to import.
 * @param {string} snapshot.state - State to activate.
 * @param {import('../main.js').DtModel} [snapshot.stateData] - Exported dt-toolbox model.
 * @returns {void}
 */
return function ( {state, stateData } ) {
// *** Import existing state to fsm
const { dtbox, query } = fsm.dependencies;
        if ( state ) {
                    fsm.state = state
                    if ( stateData ) {
                                const update = dtbox.load ( stateData ).query ( query.splitSegments )
                                fsm.stateData = fsm.stateData.query ( query.updateState, update )
                        }
            }
}} // importState func.           



export default importState


