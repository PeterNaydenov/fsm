/**
 * Bind transition-result processing to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(updateTask: import('../main.js').Task, action: string, data?: any) => void} Bound step processor.
 */
declare function _updateStep(fsm: import('../main.js').FsmContext): (updateTask: import('../main.js').Task, action: string, data?: any) => void;
export default _updateStep;
