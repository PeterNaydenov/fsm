/**
 * Bind state-data extraction to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {import('../main.js').ExtractList} Bound extractor.
 */
declare function extractList(fsm: import('../main.js').FsmContext): import('../main.js').ExtractList;
export default extractList;
