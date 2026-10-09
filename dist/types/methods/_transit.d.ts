/**
 * Bind transition dispatch to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(task: import('../main.js').Task, key: string, ...args: any[]) => void} Bound dispatcher.
 */
declare function _transit(fsm: import('../main.js').FsmContext): (task: import('../main.js').Task, key: string, ...args: any[]) => void;
export default _transit;
