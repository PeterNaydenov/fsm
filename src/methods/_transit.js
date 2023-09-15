function _transit (fsm ) {
return function () {   //  -> void
// *** Execute transition if exists. Ignore all non-predefined cases
        const
                 { state, stateData, dependencies } = fsm
                , [ task, key,...args] = arguments   // ( promiseObj, transitionKey, ...additionalData )
                , transition   = fsm.transitions [ key ]
                , system = { task, state, extractList, dependencies }
                ;
        if ( typeof transition === 'function' )   transition ( system, ...args )
        else                                      task.done ({ success : false })   // ignore all non-predefined cases


        function extractList ( list=[], options ) {
                                if ( list.length == 0 ) {   // It's a debug case. Return all data to see what is available.
                                                const query = fsm.dependencies.query;
                                                return stateData.query ( query.joinSegments ).model (() => ({as:'std'}))
                                                // Note: Don't use it in prouduction. Only for debugging during the development.
                                    }
                                if ( options )   return stateData.extractList( list, options )
                                else             return stateData.extractList( list, {as:fsm.stateDataFormat} )
                } // extractList func.
}} // _transit func.



export default _transit


