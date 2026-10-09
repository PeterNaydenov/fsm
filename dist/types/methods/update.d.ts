/**
 * Bind action updates to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(action: string, data?: any) => Promise<any>} Bound update method.
 */
declare function update(fsm: import('../main.js').FsmContext): (action: string, data?: any) => Promise<any>;
export default update;
