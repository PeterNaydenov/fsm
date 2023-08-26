import walk from '@peter.naydenov/walk'
import dtbox from 'dt-toolbox'
import methods from './methods/index.js'
import askForPromise  from 'ask-for-promise'

const MISSING_STATE = 'N/A';

function Fsm ({init, table, stateData, debug }, lib={} ) {
            const 
                  fsm   = this
                , api = {}
                ;
                
            fsm.state            = init || MISSING_STATE
            fsm.initialState     = init || MISSING_STATE
            fsm.lock             = false   // switch 'ON' during transition in progress. Write other updates in cache.
            fsm.cache            = []      // cached 'update' commands
            fsm.askForPromise    = askForPromise

            fsm.stateData        = { ...stateData } 
            fsm.initialStateData = Object.freeze ({ ...stateData })
            fsm.dependencies     = { walk, dtbox, askForPromise }
            fsm.callback = {
                             update     : []
                           , transition : []
                           , positive   : []
                           , negative   : []
                        }

            for ( let k in methods ) {
                      if ( k.startsWith('_') )   fsm[k] = methods[k](fsm)
                      else                       api[k] = methods[k](fsm)
                }

            if ( debug )   global.debugFSM = fsm

            const {transitions, nextState, chainActions } = fsm._setTransitions ( table, lib );
            if ( debug )   fsm._warn ( transitions )
            fsm.transitions   = transitions
            fsm.nextState     = nextState
            fsm.chainActions  = chainActions
            return api
} // Fsm func.  



export default Fsm


