/**
 * Bind event removal to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(import('../main.js').EventName): void} Bound removal method.
 */
function off ( fsm ) {
/**
 * Remove every handler registered for an event. Unsupported names are ignored.
 * @param {import('../main.js').EventName} eName - Event whose handler list is cleared.
 * @returns {void}
 */
return function ( eName ) {
        if ( !fsm.callback[eName] )   return
        fsm.callback[eName] = []
}} // off func.



export default off


