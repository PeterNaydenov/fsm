/**
 * Bind snapshot export to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {() => import('../main.js').ExternalState} Bound export method.
 */
declare function exportState(fsm: import('../main.js').FsmContext): () => import('../main.js').ExternalState;
export default exportState;
