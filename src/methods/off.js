function off ( fsm ) {
return function ( eName ) {
        if ( !fsm.callback[eName] )   return
        fsm.callback[eName] = []
}} // off func.



export default off


