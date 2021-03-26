
const 
         MISSING_STATE = 'N/A'
       , askForPromise  = require ( 'ask-for-promise' )
       , methods = require ( './methods/index' )
       ;

function Fsm ({init, table, stateData, debug }, lib={} ) {
            const 
                  fsm   = this
                , sData = {...stateData }
                , fnKeys = Object.keys ( methods )
                ;
                
            fsm.state            = init || MISSING_STATE
            fsm.initialState     = init || MISSING_STATE
            fsm.lock             = false   // switch 'ON' during transition in progress. Write other updates in cache.
            fsm.cache            = []      // cached 'update' commands
            fsm.askForPromise    = askForPromise

            fsm.stateData        = sData
            fsm.initialStateData = sData
            fsm.dependencies     = {}
            fsm.callback = {
                             update     : []
                           , transition : []
                           , positive   : []
                           , negative   : []
                        }

            fnKeys.forEach ( k => fsm[k] = methods[k](fsm )   )   // Attach methods to fsm

            const {transitions, nextState, chainActions } = fsm._setTransitions ( table, lib );
            if ( debug )   fsm._warn ( transitions )
            fsm.transitions   = transitions
            fsm.nextState     = nextState
            fsm.chainActions  = chainActions
} // Fsm func.  




module.exports = Fsm


