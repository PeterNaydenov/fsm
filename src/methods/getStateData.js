'use strict'

function getStateData ( fsm ) {
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
                                            const splitBr = breadcrumbs.split('/')
                                            const br = breadcrumbs.replace ( `${splitBr[0]}/`, 'root/' )
                                            store.connect ([ br ])
                                            return next ()
                                    })
                } // querySegment func.
}} // getStateData func.



export default getStateData


