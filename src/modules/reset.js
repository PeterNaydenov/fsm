function reset ( fsm ) {
return function () {
    fsm.state = fsm.initialState
    fsm.stateData = fsm.initialStateData
}} // reset func.



module.exports = reset


