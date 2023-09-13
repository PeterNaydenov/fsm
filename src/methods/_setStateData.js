'use strict'
function _setStateData ( fsm ) {
/**
 * Converts a javascript object to segmented dt-model.
 * @param {object} inData - A javascript object representation of the state data.
 * @returns {object} - Segmented dt-model representation of the state data.
 */
return function _setStateData ( inData ) {
        const { dtbox, query } = fsm.dependencies;
        return dtbox.init ( inData ).query ( query.splitSegments ).export ()        
}} // _setStateData func.



export default _setStateData


