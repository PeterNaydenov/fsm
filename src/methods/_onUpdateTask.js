function _onUpdateTask ( fsm ) {
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


