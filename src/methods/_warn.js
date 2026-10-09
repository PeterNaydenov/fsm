/**
 * Create the debug warning logger. The captured machine is currently unused.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {(transitions: Record<string, import('../main.js').Transition|null>) => void} Bound logger.
 */
function _warn ( fsm ) {
/**
 * Log a warning for each transition-library name that could not be resolved.
 * @private
 * @param {Record<string, (import('../main.js').Transition|null)>} transitions - Transition lookup table.
 * @returns {void}
 */
return function ( transitions ) {
    // *** Warn if transition function used in description table is not defined.
    Object.entries ( transitions ).forEach ( ([k,v]) => {
            if ( v == null )   console.log ( `Warning: Transition for ${k} is not defined` )
        })
}} // warn func.



export default _warn


