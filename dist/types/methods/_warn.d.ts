/**
 * Create the debug warning logger. The captured machine is currently unused.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(transitions: Record<string, import('../main.js').Transition|null>) => void} Bound logger.
 */
declare function _warn(fsm: import('../main.js').FsmContext): (transitions: Record<string, import('../main.js').Transition | null>) => void;
export default _warn;
