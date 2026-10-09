'use strict'

/**
 * Bind queue draining to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(): void} Bound queue runner.
 */
function _triggerCacheUpdate ( fsm ) {
/**
 * Remove and execute the oldest queued update, attaching its completion handler.
 * Does nothing when the queue is empty; completion drains the next item.
 * @private
 * @returns {void}
 */
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


