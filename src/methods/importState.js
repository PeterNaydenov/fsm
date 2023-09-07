function importState (fsm) {
return function ( {state, stateData } ) {
// *** Import existing state to fsm
const { dtbox } = fsm.dependencies;
        if ( state ) {
                    fsm.state = state
                    if ( stateData ) {
                                fsm.stateData = dtbox.load ( stateData )
                        }
            }
}} // importState func.           



export default importState


