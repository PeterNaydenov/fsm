/**
 * Bind dependency injection to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(deps: Record<string, any>) => void} Bound dependency setter.
 */
function setDependencies ( fsm ) {
/**
 * Shallow-merge dependencies into a new container available to future transitions.
 * Repeated calls retain earlier keys unless overridden; built-in keys may be replaced.
 * @param {Record<string, *>} deps - Dependencies to add or replace.
 * @returns {void}
 */
return function setDependencies ( deps ) {
    fsm.dependencies = { ...fsm.dependencies, ...deps }
}} // setDependencies func.



export default setDependencies


