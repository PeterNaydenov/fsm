import askForPromise  from 'ask-for-promise'    // Docs: https://github.com/PeterNaydenov/ask-for-promise
import dtbox from 'dt-toolbox'                  // Docs: https://github.com/PeterNaydenov/dt-toolbox
import { 
      splitSegments
    , joinSegments
    , updateState 
       } from '@peter.naydenov/dt-queries'     // Docs: https://github.com/PeterNaydenov/dt-queries
import methods from './methods/index.js'

const 
    MISSING_STATE = 'N/A'                     // State name if not defined
  , walk = dtbox.getWalk ()                   // Docs: https://github.com/PeterNaydenov/walk
  ;


function Fsm ({init, behavior, stateData={}, debug, stateDataFormat='std' }, lib={} ) {
            const 
                  fsm   = this
                , api = {}
                ;
                
            fsm.state            = init || MISSING_STATE
            fsm.initialState     = init || MISSING_STATE
            fsm.stateDataFormat  = stateDataFormat   // Used in 'extractList' methods (library and transitions).
            fsm.lock             = false             // Switch 'ON' during transition in progress. Write other updates in cache.
            fsm.cache            = []                // cached 'update' actions

            fsm.dependencies = { 
                                walk
                              , dtbox
                              , askForPromise
                              , query : { splitSegments, joinSegments, updateState } 
                            }

            fsm.callback = {
                             update     : []
                           , transition : []
                           , positive   : []
                           , negative   : []
                        }
                        
            for ( let k in methods ) {   // Separate public and private methods.
                      if ( k.startsWith('_') )   fsm[k] = methods[k](fsm)  // Methods with '_' are private.
                      else                       api[k] = methods[k](fsm)
                }
            
            fsm.stateData        = dtbox.init ( stateData ).query ( splitSegments )
            fsm.initialStateData = dtbox.init ( stateData ).query ( splitSegments )

            const {transitions, nextState, chainActions } = fsm._setTransitions ( behavior, lib );
            if ( debug ) {  
                        fsm._warn ( transitions )
                        global.debugFSM = fsm
                }

            fsm.transitions   = transitions
            fsm.nextState     = nextState
            fsm.chainActions  = chainActions
            return api
} // Fsm func.  



Fsm.dependencies = { walk, dtbox, askForPromise, query : { splitSegments, joinSegments, updateState } }



export default Fsm


