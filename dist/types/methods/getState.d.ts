/**
 * Bind state inspection to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {() => string} Bound state getter.
 */
declare function getState(fsm: import('../main.js').FsmContext): () => string;
export default getState;
