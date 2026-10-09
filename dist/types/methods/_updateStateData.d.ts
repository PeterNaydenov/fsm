/**
 * Bind state-data patching to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(update: import('../main.js').StateDataUpdate) => import('../main.js').DtObject} Bound patcher.
 */
declare function _updateStateData(fsm: import('../main.js').FsmContext): (update: import('../main.js').StateDataUpdate) => import('../main.js').DtObject;
export default _updateStateData;
