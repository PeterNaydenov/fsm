'use strict'

/**
 * Bind state-data patching to a machine.
 * @private
 * @param {import('../main.js').FsmContext} fsm - Internal machine storage.
 * @returns {function(import('../main.js').StateDataUpdate): import('../main.js').DtObject} Bound patcher.
 */
function _updateStateData ( fsm ) {
/**
 * Normalize a plain object, dt-model, or dt-object to segments and update existing
 * state-data fields. A non-model array logs an error and leaves data unchanged.
 * @private
 * @param {import('../main.js').StateDataUpdate} updateObject - Patch of existing fields.
 * @returns {import('../main.js').DtObject} Updated segmented data, or the current data
 * when an unsupported array is rejected.
 */
return function _updateStateData ( updateObject ) {
    
        const { dtbox, query } = fsm.dependencies;
        // Recognize the updateObject type: dt-object, dt-model or javascript object;
        let updateType = 'javascriptObject';
        // dt-objects expose `updateObject.export()` as a function. A plain
        // object that happens to have a truthy `export` property (a string,
        // a number, an object…) must NOT be misdetected as a dt-object —
        // otherwise the dtbox.load step below would call `.query()` on it
        // and crash. Hence `typeof === 'function'`, not a truthiness check.
        if ( typeof updateObject.export === 'function' )   updateType = 'dt-object'
        if ( 
                updateObject instanceof Array &&
                updateObject[0][0] === updateObject[0][2] &&
                updateObject.every ( line => line.length === 4)
            ) {
                    updateType = 'dt-model' 
            }
        if ( 
                updateType === 'javascriptObject' &&
                updateObject instanceof Array
            ) {  // Wrong updateObject! Should be an object, because property name of top-level is the name of the segment. 
                console.error ( 'State update failed. Reason: Received an array. Expectation: Object where top-level property name is the name of the data segment.' )
                return fsm.stateData
            }
            
        // Setup the update segments and root object of dt-model
        if ( ['javascriptObject'].includes(updateType)                        )   updateObject = dtbox.init ( updateObject ).export ()
        if ( ['javascriptObject','dt-model'].includes(updateType)             )   updateObject = dtbox.load ( updateObject )
        if ( ['javascriptObject','dt-model','dt-object'].includes(updateType) )   updateObject = updateObject.query ( query.splitSegments )
        // Update the state data
    
        return fsm.stateData.query ( query.updateState, updateObject )
}} // _updateStateData func.



export default _updateStateData


