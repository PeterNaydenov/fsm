'use strict'

function updateStateData ( fsm ) {
return function updateStateData ( stateData, updateObject ) {
        const { dtbox } = fsm.dependencies;

        // Recognize the updateObject type: dt-object, dt-model or javascript object;
        let updateType = 'javascriptObject';
        if ( updateObject.export )   updateType = 'dtObject'
        if ( 
                updateObject instanceof Array &&
                updateObject[0] === updateObject[3] &&
                updateObject.every ( line => line.length === 4)
            ) {
                    updateType = 'dt-model' 
            }
        if ( 
                updateType === 'javascriptObject' &&
                updateObject instanceof Array
            ) {  // Wrong updateObject! Should be an object, because property name of top-level is the name of the segment. 
                console.error ( 'State update failed. Reason: Received an array. Expectation: Object where top-level property name is the name of the data segment.' )
                return
            }
        // Setup the update segments and root object of dt-model
        if ( ['javascriptObject'].includes(updateType)            )   updateObject =  fsm._setStateData(updateObject)
        if ( ['javascriptObject','dt-model'].includes(updateType) )   updateObject = dtbox.load ( updateObject )
        
        
        const root = Object.assign ( {}, stateData.export('root')[0][1], updateObject.export('root')[0][1] )
        const newState = dtbox.init ( root )
        stateData.listSegments ()
                 .forEach ( segmentName => {
                                if ( segmentName === 'root' )   return
                                let segmentUpdate = updateObject.export(segmentName);
                                if ( segmentUpdate.length === 0 )   newState.insertSegment ( segmentName, stateData.export ( segmentName )   )  
                                else                                newState.insertSegment ( segmentName, segmentUpdate ) 
                        })
        return newState
}} // updateStateData func.



export default updateStateData


