function importState (fsm) {
return function ( {state, stateData } ) {
// *** Import existing state to fsm
const { dtbox, query } = fsm.dependencies;
        if ( state ) {
                    fsm.state = state
                    if ( stateData ) {
                                const update = dtbox.load ( stateData ).query ( query.splitSegments )
                                fsm.stateData = fsm.stateData.query ( query.updateState, update )
                        }
            }
}} // importState func.           



export default importState


