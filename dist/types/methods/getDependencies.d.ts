/**
 * Bind dependency inspection to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {() => import('../main.js').Dependencies} Bound dependency getter.
 */
declare function getDependencies(fsm: import('../main.js').FsmContext): () => import('../main.js').Dependencies;
export default getDependencies;
