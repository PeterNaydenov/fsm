/**
 * Bind queue draining to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {() => void} Bound queue runner.
 */
declare function _triggerCacheUpdate(fsm: import('../main.js').FsmContext): () => void;
export default _triggerCacheUpdate;
