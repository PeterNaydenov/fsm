import askForPromise  from 'ask-for-promise'    // Docs: https://github.com/PeterNaydenov/ask-for-promise
import dtbox from 'dt-toolbox'                  // Docs: https://github.com/PeterNaydenov/dt-toolbox
import methods from './methods/index.js'

const 
    MISSING_STATE = 'N/A'
  , walk = dtbox.getWalk ()                   // Docs: https://github.com/PeterNaydenov/walk
  ;


function Fsm ({init, table, stateData={}, debug }, lib={} ) {
            const 
                  fsm   = this
                , api = {}
                ;
                
            fsm.state            = init || MISSING_STATE
            fsm.initialState     = init || MISSING_STATE
            fsm.lock             = false   // switch 'ON' during transition in progress. Write other updates in cache.
            fsm.cache            = []      // cached 'update' actions

            fsm.dependencies     = { walk, dtbox, askForPromise }
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
            
            

            let linesOfStateData = fsm._setStateData ( stateData, dtbox )
            fsm.stateData        = dtbox.load ( linesOfStateData ) 
            fsm.initialStateData = dtbox.load ( linesOfStateData )

            const {transitions, nextState, chainActions } = fsm._setTransitions ( table, lib );
            if ( debug ) {  
                        fsm._warn ( transitions )
                        global.debugFSM = fsm
                }

            fsm.transitions   = transitions
            fsm.nextState     = nextState
            fsm.chainActions  = chainActions
            return api
} // Fsm func.  



Fsm.dependencies = { walk, dtbox, askForPromise }



export default Fsm


