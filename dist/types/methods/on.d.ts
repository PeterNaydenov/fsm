/**
 * Bind event registration to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(event: import('../main.js').EventName, callback: import('../main.js').EventCallback) => void} Bound registration method.
 */
declare function on(fsm: import('../main.js').FsmContext): (event: import('../main.js').EventName, callback: import('../main.js').EventCallback) => void;
export default on;
