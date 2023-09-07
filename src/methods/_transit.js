function _transit (fsm ) {
return function () {   //  -> void
// *** Execute transition if exists. Ignore all non-predefined cases
        const
                 { state, stateData, dependencies } = fsm
                , [ task, key,...args] = arguments   // ( promiseObj, transitionKey, ...additionalData )
                , transition   = fsm.transitions [ key ]
                , system = { task, state, stateData, dependencies }
                ;
        if ( typeof transition === 'function' )   transition ( system, ...args )
        else                                      task.done ({ success : false })   // ignore all non-predefined cases
}} // _transit func.



export default _transit


