function _warn ( fsm ) {
return function ( transitions ) {
    // *** Warn if transition function used in description table is not defined.
                fsm.___walk ({  
                          data : transitions
                        , keyCallback : (v,k) => {
                                    if ( v == null )   console.log ( `Warning: Transition for ${k} is not defined` )
                                }
                    })
}} // warn func.



module.exports = _warn


