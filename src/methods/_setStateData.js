'use strict'
function _setStateData ( fsm ) {
return function _setStateData ( inData ) {
/**
 *  Converts a javascript object to list of segments where segments are dt-models.
 */
        const 
              { dtbox } = fsm.dependencies
            , root = {}
            , segments = {}
            ;
        Object.entries ( inData ).forEach ( ([k,v]) => {
                        if ( v === null )                 root[k] = v
                        else if ( typeof v !== 'object' ) root[k] = v
                        else                              segments[k] = v
                }) // forEach entries
        let dt = dtbox.init ( root )
        Object.entries ( segments ).forEach ( ([k,v]) =>  dt.insertSegment ( k, dtbox.init(v) )   )
        return dt.export ()
}} // _setStateData func.



export default _setStateData


