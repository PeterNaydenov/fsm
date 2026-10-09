/**
 * Bind end-of-update notifications and queue release to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(data?: any) => void} Bound completion handler.
 */
declare function _onUpdateTask(fsm: import('../main.js').FsmContext): (data?: any) => void;
export default _onUpdateTask;
