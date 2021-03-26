function _warn ( fsm ) {
return function ( transitions ) {
    // *** Warn if transition function used in description table is not defined.
               Object.keys(transitions).forEach ( k => {
                       if (transitions[k] == null)   console.log ( `Warning: Transition for ${k} is not defined` )
                  })
}} // warn func.



module.exports = _warn


