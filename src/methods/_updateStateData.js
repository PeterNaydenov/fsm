'use strict'

function _updateStateData ( fsm ) {
/**
 * Updates the state data.
 * @param {object} updateObject - The update object.
 * @returns {dt-object}         - The updated state data.
 */
return function _updateStateData ( updateObject ) {
    
        const { dtbox, query } = fsm.dependencies;
        // Recognize the updateObject type: dt-object, dt-model or javascript object;
        let updateType = 'javascriptObject';
        if ( updateObject.export )   updateType = 'dt-object'
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


