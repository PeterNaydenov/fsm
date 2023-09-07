function exportState ( fsm ) {
return function exportState () {
    // *** Export internal flags and state as an object
            return {
                      state: fsm.state
                    , stateData : fsm.stateData.export ()
                 }
}} // exportState func.



export default exportState


