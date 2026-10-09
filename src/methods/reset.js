'use strict'
/**
 * Bind restoration of initial values to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {() => void} Bound reset method.
 */
function reset ( fsm ) {
/**
 * Restore the state and state data recorded during construction.
 * Does not emit events or cancel active or queued updates; those updates may
 * subsequently change the restored values.
 * @returns {void}
 */
return function () {
    const { dtbox } = fsm.dependencies;
    fsm.state = fsm.initialState
    fsm.stateData = dtbox.load ( fsm.initialStateData.export() ) 
}} // reset func.



export default reset


