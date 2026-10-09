/**
 * Bind queued-update cancellation to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(): void} Bound cancellation method.
 */
function ignoreCachedUpdates ( fsm ) {
/**
 * Cancel all queued updates and empty the queue. The active update continues.
 * Each canceled update rejects with the string `Action '<action>' was ignored`.
 * @returns {void}
 */
return function () {
    // *** Ignore all cached updates
            const cache = fsm.cache;
            cache.forEach ( ({updateTask, action, dt} ) =>  updateTask.cancel ( `Action '${action}' was ignored` ))
            fsm.cache = []
}}  // ignoreCache func.



export default ignoreCachedUpdates


