function _onUpdateTask ( fsm ) {
return function _onUpdateTask ( data ) {
    const 
           cb = fsm.callback
        ,  updateCallbacks = fsm.askForPromise ( cb['update'] )
        ;

    cb [ 'update' ].forEach ( (fn,i) => {
                    fn ( fsm.state, data )
                    updateCallbacks[i].done ()
            })

    updateCallbacks.onComplete ( x => {
                    fsm.lock = false
                    fsm._triggerCacheUpdate ()
            })
}} // _onUpdateTask func.


  
export default _onUpdateTask


