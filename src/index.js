
const 
         MISSING_STATE = 'N/A'
       , askForPromise  = require ( 'ask-for-promise' )
       , fn = require ( './modules/index' )
       ;
class Fsm {
    constructor ({init, table, stateData, debug }, lib={} ) {
            const 
                  fsm   = this
                , sData = {...stateData }
                , fnKeys = Object.keys ( fn )
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

            fnKeys.forEach ( k => fsm[k] = fn[k](fsm )   )   // Attach methods to fsm

            const result = fsm._setTransitions ( table, lib );
            if ( debug )   fsm._warn ( result.transitions )
            fsm.transitions = result.transitions
            fsm.nextState   = result.nextState
            fsm.chainActions  = result.chainActions
        } // constructor func.  
} // class Fsm



module.exports = Fsm


