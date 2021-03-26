function getState ( fsm ) {
return function () { 
        return fsm.state 
}} // getState func.



module.exports = getState


