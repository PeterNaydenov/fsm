/**
 * Bind chaining-table lookup to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(key: string) => (import('../main.js').ChainActions|false)} Bound lookup.
 */
function _getChain ( fsm ) {
/**
 * Look up the action pair for a transition key.
 * @private
 * @param {string} key - Transition key in `${state}/${action}` form.
 * @returns {import('../main.js').ChainActions|false} Chaining pair, or false when absent.
 */
return function _getChain ( key ) {
    const chainActions = fsm.chainActions;
    if ( !chainActions[key] )   return false
    return chainActions [key]
}}  // getChain func.



export default _getChain


