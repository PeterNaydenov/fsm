'use strict'

/**
 * Bind state-data extraction to a machine.
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(Array<string>=, (import('../main.js').StateDataFormat|false)=): (Array<*>|Object<string, *>)} Bound extractor.
 */
function extractList ( fsm ) {
/**
 * Extract segments or properties in request order, with `null` for missing values.
 * With no arguments, return all joined data as a standard JavaScript object.
 * With a list, model object segments using the supplied format or the machine's
 * `stateDataFormat`; primitive values are returned directly.
 *
 * @param {Array<string>} [requestedSegments] - Segment or property names. Omit
 * the argument entirely to read all data; an empty list returns an empty list.
 * @param {import('../main.js').StateDataFormat|false} [options=false] - Extraction
 * format options; `false` uses the machine's configured default.
 * @returns {Array<*>|Object<string, *>} Requested values, or all data when called without arguments.
 * @throws {Error} If dt-toolbox receives invalid format options.
 * @example
 * const [count, settings] = machine.extractList(['count', 'settings'], {as: 'std'});
 * const allData = machine.extractList();
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


