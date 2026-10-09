/**
 * Bind snapshot export to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(): import('../main.js').ExternalState} Bound export method.
 */
function exportState ( fsm ) {
/**
 * Export the current state and joined state data for later import.
 * Only state and data are included; dependencies, handlers, and pending updates
 * are not part of the snapshot. Data uses the dt-toolbox model rather than a plain object.
 * @returns {import('../main.js').ExternalState} Snapshot with a `stateData` model.
 * @example
 * const snapshot = machine.exportState();
 * machine.importState(snapshot);
 */
return function exportState () {
    const { query } = fsm.dependencies;
    // *** Export internal flags and state as an object
            return {
                      state: fsm.state
                    , stateData : fsm.stateData.query ( query.joinSegments ).export ()
                 }
}} // exportState func.



export default exportState


