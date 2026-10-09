/**
 * Bind end-of-update notifications and queue release to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(*=): void} Bound completion handler.
 */
function _onUpdateTask ( fsm ) {
/**
 * Notify 'update' handlers with the final state and response, then release the
 * lock and start the next queued update. Handler return values are ignored.
 * @private
 * @param {*} [data] - Final transition response.
 * @returns {void}
 */
return function _onUpdateTask ( data ) {
    const 
           cb = fsm.callback
        ,  updateCallbacks = fsm.dependencies.askForPromise ( cb['update'] )
        ;

    updateCallbacks.each ( ({value:fn, done }) => {
                    fn ( fsm.state, data )
                    done ()
                })

    updateCallbacks.onComplete ( x => {
                    fsm.lock = false
                    fsm._triggerCacheUpdate ()
            })
}} // _onUpdateTask func.


  
export default _onUpdateTask


