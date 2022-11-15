function _transit (fsm ) {
return function ( task, key, dt ) {   //   ( promiseObj, transitionKey, additionalData ) -> void
// *** Execute transition if exists. Ignore all non-predefined cases
        const
                  dependencies = fsm.dependencies
                , stateData    = fsm.___walk ({ data:fsm.stateData })
                , transition   = fsm.transitions [ key ]
                ;
        if ( typeof transition === 'function' )   transition ( task, dependencies, stateData, dt )
        else                                      task.done ({ success : false })   // ignore all non-predefined cases
}} // _transit func.



export default _transit


