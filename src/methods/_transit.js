function _transit (fsm ) {
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


