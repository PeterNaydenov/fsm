/**
 * Bind transition dispatch to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(import('../main.js').Task, string, ...*): void} Bound dispatcher.
 */
function _transit (fsm ) {
/**
 * Invoke the transition with its task, current state, extractor, and dependencies.
 * Missing or non-function transitions complete the task with `{success: false}`.
 * @private
 * @param {import('../main.js').Task} task - Task completed by the transition.
 * @param {string} key - Transition key in `${state}/${action}` form.
 * @param {...*} args - Additional transition input; normally one data value.
 * @returns {void}
 */
return function () {   //  -> void
// *** Execute transition if exists. Ignore all non-predefined cases
        const
                  [ task, key,...args] = arguments   // ( promiseObj, transitionKey, ...additionalData )
                , { state, stateData, dependencies } = fsm
                , transition   = fsm.transitions [ key ]
                , extractList = fsm.api.extractList
                , system = { task, state, extractList, dependencies }
                ;
        if ( typeof transition === 'function' )   transition ( system, ...args )
        else                                      task.done ({ success : false })   // ignore all non-predefined cases

}} // _transit func.



export default _transit


