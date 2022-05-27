function importState (fsm) {
return function ( {state, stateData} ) {
// *** Import existing state to fsm
        const { walk } = fsm.dependencies;
        if ( state ) {
                    fsm.state = state
                    fsm.stateData = walk ( stateData )
                    // TODO: test if stateData exist ??!
            }
}} // importState func.           



module.exports = importState


