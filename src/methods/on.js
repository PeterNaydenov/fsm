function on ( fsm ) {
return function ( eName, fn) {
// *** Register callback functions on: 'update', 'transition', 'negative', 'positive'
    const cb = fsm.callback;
    if ( cb[eName] )   cb[eName].push ( fn )
}} // on func.



export default on


