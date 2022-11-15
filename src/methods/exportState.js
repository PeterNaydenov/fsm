function exportState (fsm) {
return function () {
    // *** Export internal flags and state as an object
            const 
                  state     = fsm.state
                , stateData = fsm.___walk ({ data : fsm.stateData })
                ;
            return {
                      state
                    , stateData
                 }
}} // exportState func.



export default exportState


