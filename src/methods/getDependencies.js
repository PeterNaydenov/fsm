/**
 * Bind dependency inspection to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {() => import('../main.js').Dependencies} Bound dependency getter.
 */
function getDependencies (fsm) {
/**
 * Read the current built-in and injected dependencies.
 * @returns {import('../main.js').Dependencies} The live dependency object, not a copy.
 */
return function getDependencies () {
        return fsm.dependencies
}} // getDependencies func.



export default getDependencies


