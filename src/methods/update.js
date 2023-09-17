function update ( fsm ) {
/**
 * @method update
 * @description Executes transition-functions or sets transition steps into a cache queue
 * @param {string} action - action name.
 * @param {any} dt - any upcoming data.
 * @returns {Promise} - Promise<transitionResponse>
 */
return function update ( action, dt ) {   //   () -> Promise<transitionResponse>
// *** Executes transition-functions and transition-chains.
        const
             { askForPromise } = fsm.dependencies 
           , updateTask = askForPromise ()
           ;
 
        if ( fsm.lock ) {  
                fsm.cache.push ( { updateTask, action, dt })
                return updateTask.promise
            }
      
        fsm._updateStep ( updateTask, action, dt )
        updateTask.onComplete ( data =>  fsm._onUpdateTask ( data )   )
        return updateTask.promise
}} // update func.



export default update


