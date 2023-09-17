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
        

            const query = fsm.dependencies.query;
            // v--- It's a debug case. Return all data to see what is available.
            if ( arguments.length == 0 )  return fsm.stateData.query ( query.joinSegments ).model (() => ({as:'std'}))

            if ( !options )   return fsm.stateData.extractList ( requestedSegments, fsm.stateDataFormat )
            else              return fsm.stateData.extractList ( requestedSegments, options )
}} // extractList func.



export default extractList


