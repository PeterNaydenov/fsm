'use strict'

function getStateData ( fsm ) {
/**
 *  Returns a list of requested segments from the state data.
 *  @param {array.<string>} requestedSegments       - The list of requested segments.
 *  @param {string|boolean} [options=false]         - The model option for the query.
 *  @returns {array.<[object,string,number,null]>}  - The list of requested segments.
 */
return function getStateData ( requestedSegments, options=false ) {
            const rootElement = fsm.stateData.export('root')[0][1];
            let segmentList = fsm.stateData.listSegments ();

            return requestedSegments.map ( segmentName => {
                            if ( !segmentList.includes(segmentName) ) {  
                                        let property = rootElement[segmentName]
                                        if ( property != null ) return property
                                        return null
                                }
                            if ( options )  return fsm.stateData.query ( querySegment, segmentName ).model ( () => options )
                            else            return fsm.stateData.query ( querySegment, segmentName )
                    })

            function querySegment ( store, segmentName ) {
                            store
                                .from ( segmentName )
                                .look (({ flatData, name, breadcrumbs, next }) => {
                                            if ( name === segmentName ) {
                                                    store.set ( 'root', flatData )
                                                    return next ()  
                                                }
                                            store.set ( name, flatData )
                                            const 
                                                  splitBr = breadcrumbs.split('/')
                                                , br      = breadcrumbs.replace ( `${splitBr[0]}/`, 'root/' )
                                                ;
                                            store.connect ([ br ])
                                            return next ()
                                    })
                } // querySegment func.
}} // getStateData func.



export default getStateData


