function update ( fsm ) {
return function ( action, dt ) {   //   () -> Promise<transitionResponse>
// *** Executes transition-functions and transition-chains.
        const updateTask = fsm.askForPromise ();
        
        if ( fsm.lock ) {  
                fsm.cache.push ( { updateTask, action, dt })
                return updateTask.promise
            }
            
        fsm._updateStep ( updateTask, action, dt )
        updateTask.onComplete ( data =>  fsm._onUpdateTask ( data )   )
        return updateTask.promise
}} // update func.



export default update


