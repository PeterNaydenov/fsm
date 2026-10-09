/**
 * Bind chaining-table lookup to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(key: string) => (import('../main.js').ChainActions|false)} Bound lookup.
 */
declare function _getChain(fsm: import('../main.js').FsmContext): (key: string) => (import('../main.js').ChainActions | false);
export default _getChain;
