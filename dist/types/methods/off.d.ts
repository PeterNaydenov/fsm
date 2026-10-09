/**
 * Bind event removal to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(event: import('../main.js').EventName) => void} Bound removal method.
 */
declare function off(fsm: import('../main.js').FsmContext): (event: import('../main.js').EventName) => void;
export default off;
