/**
 * Bind transition-result processing to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(import('../main.js').Task, string, *=): void} Bound step processor.
 */
function _updateStep ( fsm ) {
/**
 * Lock the machine, dispatch one step, apply successful state/data changes, and
 * notify outcome and transition handlers. Run the selected chain action with
 * the step's response, or complete the parent update task when the chain ends.
 * Step-task rejection is logged; it does not complete the parent update task.
 * @private
 * @param {import('../main.js').Task} updateTask - Parent task for the entire update chain.
 * @param {string} action - Action evaluated against the current state.
 * @param {*} [data] - Input passed to this transition.
 * @returns {void}
 */
return function ( updateTask, action, data ) {
    const 
          { askForPromise } = fsm.dependencies
        , task = askForPromise ()
        , key  = `${fsm.state}/${action}`
        , cb   = fsm.callback   // Event-based callbacks
        ;

    fsm.lock = true
    fsm._transit ( task, key, data )
    task.onComplete (
            result => {
                    let 
                          chainActions = fsm._getChain ( key )
                        , data = result.response
                        ;
                    if ( result.success ) {
                            fsm.state = fsm.nextState [ key ]
                            if ( result.stateData != null   )   fsm.stateData = fsm._updateStateData ( result.stateData ) 
                        
                            cb [ 'positive'   ].forEach ( fn => fn ( fsm.state, data)   )
                            cb [ 'transition' ].forEach ( fn => fn ( fsm.state, data)   )
                            if ( chainActions && chainActions[0] ) {
                                    fsm._updateStep ( updateTask, chainActions[0], data )   // Positive altAction index
                                    return
                               }
                        }
                    else {
                            cb [ 'negative'   ].forEach ( fn => fn ( fsm.state, data)   )
                            cb [ 'transition' ].forEach ( fn => fn ( fsm.state, data)   )
                            if ( chainActions && chainActions[1] ) {
                                    fsm._updateStep ( updateTask, chainActions[1], data )   // Negative altAction index
                                    return
                               }
                         }
                    updateTask.done ( data )
            }) // task onComplete

    task.promise.catch ( () =>  console.log ( `Failed in step ${key}`)   )
}}  // updateStep func.



export default _updateStep


