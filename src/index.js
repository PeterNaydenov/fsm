
const 
       MISSING_STATE = 'N/A';

class Fsm {
    constructor ({init, table, stateData}, lib={} ) {
            const 
                  fsm   = this
                , sData = Object.assign ( {}, stateData )
                ;
            fsm.state            = init || MISSING_STATE
            fsm.initialState     = init || MISSING_STATE

            fsm.stateData        = sData
            fsm.initialStateData = sData
            fsm.dependencies     = {}

            const result = fsm._setTransitions ( table, lib );
            fsm._warn ( result.transitions )
            fsm.transitions = result.transitions
            fsm.nextState   = result.nextState
        } // constructor func.





     _warn ( data ) {
                Object.keys(data).forEach ( k => {
                        if (data[k] == null)   console.log ( `Warning: Transition for ${k} is not defined` )
                   })
        } // _warn func.






     _setTransitions ( data, lib ) {   // ( machineTable, transitionLib ) --> {transitions, nextState}
                let 
                       transitions = {}
                     , nextState = {}
                     ;
                data.forEach ( el => {
                        const 
                              [ from, action, next, transitionName ] = el
                            , transition = lib [ transitionName ]
                            ;
                        transitions[`${from}/${action}`] = transition || null
                        nextState  [`${from}/${action}`] = next
                   })
                return { transitions, nextState }
        } // setTransitions


      


     setDependencies ( deps ) {
                this.dependencies = Object.assign ( {}, this.dependencies, deps )
        } // setDependencies func.





     transit ( key, dt ) {
                const
                      fsm = this
                    , dependencies = fsm.dependencies
                    , stateData  = Object.assign ( {}, fsm.stateData )
                    , transition = fsm.transitions [ key ]
                    ;
                if ( typeof transition === 'function' ) {
                        return transition ( dependencies, stateData, dt )
                   }
                else return { success : false }   // ignore all non-predefined cases
        } // transit func.





      getState () { return this.state }
        




      update ( action, dt ) {
                const 
                      fsm = this
                    , key = `${fsm.state}/${action}`
                    ;
                const result = fsm.transit ( key, dt )

                if ( result.success ) {
                        fsm.state     = fsm.nextState [ key ]
                        if ( result.stateData )   fsm.stateData = result.stateData
                  }
                if ( result.command )   return fsm.update ( result.command, result.response )
                else                    return result.response
        } // update func.





     reset () {
             const fsm = this;
             fsm.state = fsm.initialState
             fsm.stateData = fsm.initialStateData
        } // reset func.

} // class fsm


module.exports = Fsm 