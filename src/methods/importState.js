function importState (fsm) {
return function ( {state, stateData } ) {
// *** Import existing state to fsm
        if ( state ) {
                    fsm.state = state
                    if ( stateData ) {
                                fsm.stateData = { ...stateData }
                        }
            }
}} // importState func.           



export default importState


