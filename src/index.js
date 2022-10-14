
const 
         MISSING_STATE = 'N/A'
       , askForPromise  = require ( 'ask-for-promise' )
       , methods        = require ( './methods/index' )
       , walk           = require ( '@peter.naydenov/walk' )
       ;

function Fsm ({init, table, stateData, debug }, lib={} ) {
            const fsm   = this;
                
            fsm.state            = init || MISSING_STATE
            fsm.initialState     = init || MISSING_STATE
            fsm.lock             = false   // switch 'ON' during transition in progress. Write other updates in cache.
            fsm.cache            = []      // cached 'update' commands
            fsm.askForPromise    = askForPromise
            fsm.___walk          = walk

            fsm.stateData        = walk ({ data:stateData }) 
            fsm.initialStateData = walk ({ data:stateData })
            fsm.dependencies     = { walk, askForPromise }
            fsm.callback = {
                             update     : []
                           , transition : []
                           , positive   : []
                           , negative   : []
                        }

            walk ({   // Attach methods to fsm
                      data:methods
                    , keyCallback : ({key:k}) => fsm[k] = methods[k](fsm)   
                })   

            const {transitions, nextState, chainActions } = fsm._setTransitions ( table, lib );
            if ( debug )   fsm._warn ( transitions )
            fsm.transitions   = transitions
            fsm.nextState     = nextState
            fsm.chainActions  = chainActions
} // Fsm func.  




module.exports = Fsm


