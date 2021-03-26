function _getChain () {
return function ( chainActions, key ) {
    if ( !chainActions[key] )   return false
    return chainActions [key]
}}  // getChain func.



module.exports = _getChain


