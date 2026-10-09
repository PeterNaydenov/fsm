/**
 * Bind queued-update cancellation to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {() => void} Bound cancellation method.
 */
declare function ignoreCachedUpdates(fsm: import('../main.js').FsmContext): () => void;
export default ignoreCachedUpdates;
