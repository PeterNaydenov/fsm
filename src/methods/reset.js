'use strict'
function reset ( fsm ) {
return function () {
    const { dtbox } = fsm.dependencies;
    fsm.state = fsm.initialState
    fsm.stateData = dtbox.load ( fsm.initialStateData.export() ) 
}} // reset func.



export default reset


