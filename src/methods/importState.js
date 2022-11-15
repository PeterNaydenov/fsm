function importState (fsm) {
return function ( {state, stateData} ) {
// *** Import existing state to fsm
        if ( state ) {
                    fsm.state = state
                    fsm.stateData = fsm.___walk ({ data : stateData })
                    // TODO: test if stateData exist ??!
            }
}} // importState func.           



export default importState


