/**
 * Bind snapshot import to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(snapshot: import('../main.js').ExternalState) => void} Bound import method.
 */
declare function importState(fsm: import('../main.js').FsmContext): (snapshot: import('../main.js').ExternalState) => void;
export default importState;
