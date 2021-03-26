function importState (fsm) {
return function ( {state, stateData} ) {
// *** Import existing state to fsm
        if ( state ) {
                    fsm.state = state
                    fsm.stateData = { ...stateData }
            }
}} // importState func.           



module.exports = importState


