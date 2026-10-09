/**
 * Bind dependency injection to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(Object<string, *>): void} Bound dependency setter.
 */
function setDependencies ( fsm ) {
/**
 * Shallow-merge dependencies into a new container available to future transitions.
 * Repeated calls retain earlier keys unless overridden; built-in keys may be replaced.
 * @param {Object<string, *>} deps - Dependencies to add or replace.
 * @returns {void}
 */
return function setDependencies ( deps ) {
    fsm.dependencies = { ...fsm.dependencies, ...deps }
}} // setDependencies func.



export default setDependencies


