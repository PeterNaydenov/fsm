function exportState (fsm) {
return function () {
    // *** Export internal flags and state as an object
            const 
                  state     = fsm.state
                ,  { walk } = fsm.dependencies
                , stateData = walk ( fsm.stateData )
                ;
            return {
                      state
                    , stateData
                 }
}} // exportState func.



module.exports = exportState


