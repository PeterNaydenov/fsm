function _updateStep ( fsm ) {
return function ( updateTask, action, dt ) {
    const 
          { askForPromise } = fsm.dependencies
        , task = askForPromise ()
        , key  = `${fsm.state}/${action}`
        , cb   = fsm.callback
        ;
    fsm.lock = true
    fsm._transit ( task, key, dt )
    task.onComplete (
            result => {
                    /**
                     *    Result description:
                     *  {
                     *       success   - boolean. Is it transition successful.
                     *     ? stateData - object. Flat object with fsm state values.
                     *     ? response  - object. External data as response of transition if needed.
                     *     ? command   - string. Next action if function-chaining. (depricated!) Use a chainAction inside the logic table
                     *  }
                     */

                    let 
                          chainActions = fsm._getChain ( fsm.chainActions, key)
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


