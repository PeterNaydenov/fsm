/**
 * Bind state inspection to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(): string} Bound state getter.
 */
function getState ( fsm ) {
/**
 * Read the current machine state.
 * @returns {string} Current state, or 'N/A' when no initial state was provided.
 */
return function () { 
        return fsm.state 
}} // getState func.



export default getState


