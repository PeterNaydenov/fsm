'use strict'

function extractList ( fsm ) {
/**
 *  Returns a list of requested segments from the state data.
 *  @param {array.<string>} requestedSegments       - The list of requested segments.
 *  @param {string|boolean} [options=false]         - The model option for the query.
 *  @returns {array.<[object,dt-object,string,number,null]>}  - The list of requested segments.
 */
return function extractList ( requestedSegments, options=false ) {
// *** Returns a list of requested segments
        
            // v--- It's a debug case. Return all data to see what is available.
            const query = fsm.dependencies.query;
            if ( arguments.length == 0 )  return stateData.query ( query.joinSegments ).model (() => ({as:'std'}))
            // Note: Don't use it in production. Only for debugging during the development.

            let format = fsm.stateDataFormat;
            if ( !options )   return fsm.stateData.extractList ( requestedSegments, {as:format} )
            else              return fsm.stateData.extractList ( requestedSegments, options )
}} // extractList func.



export default extractList


