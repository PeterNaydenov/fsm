'use strict'

function extractList ( fsm ) {
/**
 *  Returns a list of requested segments from the state data.
 *  @param {array.<string>} requestedSegments       - The list of requested segments.
 *  @param {string|boolean} [options=false]         - The model option for the query.
 *  @returns {array.<[object,dt-object,string,number,null]>}  - The list of requested segments.
 */
return function extractList ( requestedSegments, options=false ) {
            let format = fsm.stateDataFormat;
            if ( !options )   return fsm.stateData.extractList ( requestedSegments, {as:format} )
            else              return fsm.stateData.extractList ( requestedSegments, options )
}} // extractList func.



export default extractList


