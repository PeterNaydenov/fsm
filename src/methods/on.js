/**
 * Bind event registration to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(event: import('../main.js').EventName, callback: import('../main.js').EventCallback) => void} Bound registration method.
 */
function on ( fsm ) {
/**
 * Append a synchronous event handler. Multiple handlers run in registration order.
 * 'positive' or 'negative' runs before 'transition' for each step; 'update' runs
 * once after the whole chain. Unsupported event names are ignored.
 * @param {import('../main.js').EventName} eName - Event to observe.
 * @param {import('../main.js').EventCallback} fn - Receives the current state and response.
 * @returns {void}
 * @example
 * machine.on('update', (state, response) => console.log(state, response));
 */
return function ( eName, fn) {
// *** Register callback functions on: 'update', 'transition', 'negative', 'positive'
    const cb = fsm.callback;
    if ( cb[eName] )   cb[eName].push ( fn )
}} // on func.



export default on


