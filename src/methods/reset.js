function reset ( fsm ) {
return function () {
    const { walk } = fsm.dependencies;
    fsm.state = fsm.initialState
    fsm.stateData = walk ( fsm.initialStateData )
}} // reset func.



module.exports = reset


