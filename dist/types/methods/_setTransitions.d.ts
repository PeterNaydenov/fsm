/**
 * Create the behavior-table compiler. This factory does not need machine storage.
 * @private
 * @returns {(behavior: Array<import('../main.js').BehaviorRow>, lib: import('../main.js').TransitionLibrary) => import('../main.js').TransitionTables} Bound compiler.
 */
declare function _setTransitions(): (behavior: Array<import('../main.js').BehaviorRow>, lib: import('../main.js').TransitionLibrary) => import('../main.js').TransitionTables;
export default _setTransitions;
