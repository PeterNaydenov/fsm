/**
 * Bind action updates to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(action: string, data?: any) => Promise<any>} Bound update method.
 */
function update ( fsm ) {
/**
 * Execute an action and any resulting chain, or queue it while an update is active.
 * Queued actions are evaluated against the state when they begin executing.
 * Unknown state/action pairs and missing functions produce unsuccessful steps;
 * without a chain their promises resolve with `undefined`.
 *
 * @param {string} action - Action name from the behavior table.
 * @param {*} [dt] - Input passed to the first transition.
 * @returns {Promise<*>} Final transition's response. Rejects if the queued update
 * is canceled by `ignoreCachedUpdates()`.
 * @example
 * const response = await machine.update('start', {source: 'button'});
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


