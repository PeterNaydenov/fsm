function exportState ( fsm ) {
return function exportState () {
    const { query } = fsm.dependencies;
    // *** Export internal flags and state as an object
            return {
                      state: fsm.state
                    , stateData : fsm.stateData.query ( query.joinSegments ).export ()
                 }
}} // exportState func.



export default exportState


