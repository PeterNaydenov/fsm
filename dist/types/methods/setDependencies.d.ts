/**
 * Bind dependency injection to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(deps: Record<string, any>) => void} Bound dependency setter.
 */
declare function setDependencies(fsm: import('../main.js').FsmContext): (deps: Record<string, any>) => void;
export default setDependencies;
