function _getChain ( fsm ) {
return function _getChain ( key ) {
    const chainActions = fsm.chainActions;
    if ( !chainActions[key] )   return false
    return chainActions [key]
}}  // getChain func.



export default _getChain


