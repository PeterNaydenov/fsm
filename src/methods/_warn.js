function _warn ( fsm ) {
return function ( transitions ) {
    // *** Warn if transition function used in description table is not defined.
    Object.entries ( transitions ).forEach ( ([v,k]) => {
            if ( v == null )   console.log ( `Warning: Transition for ${k} is not defined` )
        })
}} // warn func.



export default _warn


