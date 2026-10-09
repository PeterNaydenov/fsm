/**
 * Bind restoration of initial values to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {() => void} Bound reset method.
 */
declare function reset(fsm: import('../main.js').FsmContext): () => void;
export default reset;
