function ignoreCachedUpdates ( fsm ) {
return function () {
    // *** Ignore all cached updates
            const cache = fsm.cache;
            cache.forEach ( ({updateTask, action, dt} ) =>  updateTask.cancel ( `Action '${action}' was ignored` ))
            fsm.cache = []
}}  // ignoreCache func.



export default ignoreCachedUpdates


