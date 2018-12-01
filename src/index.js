
const 
         MISSING_STATE = 'N/A'
       , askForPromise = require ( 'ask-for-promise' )
       ;

class Fsm {
    constructor ({init, table, stateData, debug }, lib={} ) {
            const 
                  fsm   = this
                , sData = Object.assign ( {}, stateData )
                ;
            fsm.state            = init || MISSING_STATE
            fsm.initialState     = init || MISSING_STATE

            fsm.stateData        = sData
            fsm.initialStateData = sData
            fsm.dependencies     = {}
            fsm.callback = {
                             update     : []
                           , transition : []
                           , positive   : []
                           , negative   : []
                        }

            const result = fsm._setTransitions ( table, lib );
            if ( debug )   fsm._warn ( result.transitions )
            fsm.transitions = result.transitions
            fsm.nextState   = result.nextState
            fsm.chainActions  = result.chainActions
        } // constructor func.





     _warn ( data ) {
     // *** Warn if transition function used in description table is not defined.
                Object.keys(data).forEach ( k => {
                        if (data[k] == null)   console.log ( `Warning: Transition for ${k} is not defined` )
                   })
        } // _warn func.





     _setTransitions ( data, lib ) {   // ( machineTable, transitionLib ) --> {transitions, nextState, chainActions}
     // *** Converts initial FSM data to useful fsm objects.
                let 
                       fsm = this
                     , transitions = {}
                     , nextState = {}
                     , chainActions = {}
                     ;
                data.forEach ( el => {
                        const 
                              [ from, action, next, transitionName, alt ] = el
                            , transition = lib [ transitionName ]
                            , key = `${from}/${action}`
                            ;
                        transitions[key] = transition || null
                        nextState  [key] = next
                        if ( fsm._isAltValid(alt) ) {  
                                chainActions [key] = []
                                chainActions [key][0] = alt[0]
                                chainActions [key][1] = alt[1]
                           }
                   })
                return { transitions, nextState, chainActions }
        } // setTransitions





     _isAltValid ( alt ) {   //   (altAction) -> boolean
     // *** Check if alt is valid altAction.
                if ( !(alt instanceof Array) )   return false
                if ( alt.length != 2         )   return false
                alt.forEach ( m => {
                                if ( m !== false ||  typeof m != 'string' )    return false
                        })
                return true
        } // _isAltValid func.





     setDependencies ( deps ) {
                this.dependencies = Object.assign ( {}, this.dependencies, deps )
        } // setDependencies func.
     




     on ( eName, fn) {
     // *** Register callback functions on: 'update', 'transition', 'negative', 'positive'
                const 
                      fsm = this
                    , cb = fsm.callback;
                if ( cb[eName] )   cb[eName].push ( fn )
        } // on func.




     off ( eName ) {
             if ( !fsm.callback[eName] )   return
             fsm.callback[eName] = []
        } // off func.





     transit ( task, key, dt ) {   // ( promiseObj, transitionKey, additionalData ) -> void
     // *** Execute transition if exists. Ignore all non-predefined cases
                const
                      fsm = this
                    , dependencies = Object.assign ( {}, fsm.dependencies )
                    , stateData    = Object.assign ( {}, fsm.stateData )
                    , transition   = fsm.transitions [ key ]
                    ;
                if ( typeof transition === 'function' )   transition ( task, dependencies, stateData, dt )
                else                                      task.done ({ success : false })   // ignore all non-predefined cases
        } // transit func.





      getState () { return this.state }
        




      update ( action, dt ) {   // () -> Promise<transitionResponse>
      // *** Executes transition-functions and transition-chains.
                const 
                      fsm = this
                    , theUpdate = askForPromise ()
                    ;
                fsm._updateStep ( theUpdate, action, dt )
                return theUpdate.promise
        } // update func.





     _updateStep ( theUpdate, action, dt ) {
                const 
                      fsm = this
                    , task = askForPromise ()
                    , key  = `${fsm.state}/${action}`
                    , oldState = fsm.state
                    ;
                fsm.transit ( task, key, dt )
                task.onComplete (
                        result => {
                                /**
                                 *    Result description:
                                 *  {
                                 *       success   - boolean. Is it transition successful.
                                 *     ? stateData - object. Flat object with fsm state values.
                                 *     ? response  - object. External data as response of transition if needed.
                                 *     ? command   - string. Next action if function-chaining.
                                 *  }
                                 */
                                
                                let 
                                      chainActions = fsm._getChain ( fsm.chainActions, key)
                                    , data = result.response
                                    , cb   = fsm.callback
                                    ;
                                
                                if ( result.success ) {
                                        fsm.state = fsm.nextState [ key ]
                                        if ( result.stateData )   fsm.stateData = result.stateData
                                        cb [ 'positive'   ].forEach ( fn => fn ( fsm.state, data)   )
                                        cb [ 'transition' ].forEach ( fn => fn ( fsm.state, data)   )
                                        if ( chainActions && chainActions[0] ) {
                                                fsm._updateStep ( theUpdate, chainActions[0], data )   // Positive altAction index
                                                return
                                           }
                                    }
                                else {
                                        cb [ 'negative'   ].forEach ( fn => fn ( fsm.state, data)   )
                                        cb [ 'transition' ].forEach ( fn => fn ( fsm.state, data)   )
                                        if ( chainActions && chainActions[1] ) {
                                                fsm._updateStep ( theUpdate, chainActions[1], data )   // Negative altAction index
                                                return
                                           }
                                     }
                                if ( result.command ) {
                                           fsm._updateStep ( theUpdate, result.command, data )
                                           return
                                      }
                                cb [ 'update' ].forEach ( fn => fn ( fsm.state, data)   )
                                theUpdate.done ( data )
                        }) // onComplete
                task.promise.catch ( () =>  console.log ( `Failed in step ${key}`)   )
        }  // updateStep func.





     _getChain ( chainActions, key ) {
                if ( !chainActions[key] )   return false
                return chainActions [key]
        }  // getAlt func.





     reset () {
             const fsm = this;
             fsm.state = fsm.initialState
             fsm.stateData = fsm.initialStateData
        } // reset func.

} // class Fsm



module.exports = Fsm


