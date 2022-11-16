function reset ( fsm ) {
return function () {
    fsm.state = fsm.initialState
    fsm.stateData = {}
    Object.entries ( fsm.initialStateData ).forEach ( ([key,value]) => fsm.stateData[key] = value )
}} // reset func.



export default reset


