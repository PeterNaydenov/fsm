'use strict'

function _triggerCacheUpdate ( fsm ) {
return function () {
        if ( fsm.cache.length !== 0 ) {
                const { updateTask, action, dt } = fsm.cache [0]
                fsm.cache = fsm.cache.reduce ( (res,el,i) => {
                                        if ( i != 0 )   res.push(el)
                                        return res
                                },[] )

                fsm._updateStep ( updateTask, action, dt )
                updateTask.onComplete ( data => fsm._onUpdateTask ( data )   )
            }
}}  // _triggerCacheUpdate func.



export default _triggerCacheUpdate


