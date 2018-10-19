
const
       Fsm = require ('../src/index') 
     , chai = require ( 'chai' )
     , expect = require ( 'expect.js')
     ;

describe ( 'Finite State Machine', () => {
    

    
    it ( 'Check FSM structure', () => {
            // SETUP - provide machine description and transition library.
            const 
                    lib   = {
                                switchON ( dependencies, stateData, dt ) {
                                        return { success  : true }
                                    }
                            }
                  , machine = {
                                 init : 'none'
                               , table   : [
                                           // [ fromState, action, nextState, transition ]
                                              [ 'none',   'activate', 'active', 'switchON'  ]
                                            , [ 'active', 'stop',     'none',   'switchOFF' ]
                                        ]
                          }
                ;

            // Create fsm. Inspect all expected values.

            const fsm = new Fsm ( machine, lib );
            fsm.update ( 'activate' ) // State from 'none' to 'active'
            fsm.update ( 'stop' )     // Will not change anything. Transition is not defined
            
            expect ( fsm.state ).to.be.equal ( 'active' )
            expect ( fsm.initialState ).to.be.equal ( 'none' )
            expect ( fsm.stateData ).to.be.empty
            expect ( fsm.initialStateData ).to.be.empty
            expect ( fsm.dependencies ).to.be.empty

            expect ( fsm.transitions ).to.have.property ( 'none/activate' )
            expect ( fsm.transitions ).to.have.property ( 'active/stop'   )
            expect ( fsm.transitions['none/activate'] ).to.be.a.function
            expect ( fsm.transitions['active/stop'] ).to.be.equal(null)
            
            expect ( fsm.nextState).to.have.property ( 'none/activate' )
            expect ( fsm.nextState).to.have.property ( 'active/stop'   )

            expect ( fsm.nextState['none/activate'] ).to.be.equal ( 'active' )
            expect ( fsm.nextState['active/stop'] ).to.be.equal ( 'none' )
        }) // it minimal working configuration





        it ( 'Read "stateData" from transition function. Provide update-response.', () => {
        // *** Convert stateData to update-response
            const 
                  lib   = {
                                switchON ( dependencies, stateData, dt ) {
                                        return { success  : true, response: stateData }
                                    }
                                , switchOFF () {}
                        }
                , machine = {
                                 init  : 'none'
                               , table : [
                                           // [ fromState, action, nextState, transition ]
                                              [ 'none',   'activate', 'active', 'switchON'  ]
                                            , [ 'active', 'stop',     'none',   'switchOFF' ]
                                        ]
                                , stateData : { say:'hi' }
                        }
                ;
            const fsm = new Fsm ( machine, lib );
            const result = fsm.update ( 'activate' );

            expect ( result ).to.have.property ( 'say' )
            expect ( result.say ).to.be.equal ( 'hi' )
        }) // it Read 'stateData' from transition func.





        it ( 'Use dependencies', () => {
            // *** Convert dependencies to update-response
                const 
                      lib   = {
                                    switchON ( dependencies, stateData, dt ) {
                                            const {test} = dependencies;
                                            return { success  : true, response: test }
                                        }
                                    , switchOFF () {
                                            return { success: true }
                                        }
                            }
                    , machine = {
                                     init  : 'none'
                                   , table : [
                                               // [ fromState, action, nextState, transition ]
                                                  [ 'none',   'activate', 'active', 'switchON'  ]
                                                , [ 'active', 'stop',     'none',   'switchOFF' ]
                                            ]
                                    , stateData : { say:'hi' }
                            }
                    , test = { say: 'hi'}   // random object that will become a fsm dependency
                    ;
                const fsm = new Fsm ( machine, lib );
                fsm.setDependencies ({test})

                const result = fsm.update ( 'activate' );
    
                expect ( result ).to.have.property ( 'say' )
                expect ( result.say ).to.be.equal ( 'hi' )
            }) // it   Use 'dependencies'





            it ( 'Reset ', () => {
                // *** Reset fsm state and stateData
                    const 
                          lib   = {
                                        switchON ( dependencies, stateData, dt ) {
                                                stateData.say = 'yo-ho-ho'
                                                return { success  : true, stateData }
                                            }
                                        , switchOFF () {
                                                return { success: true }
                                            }
                                }
                        , machine = {
                                         init  : 'none'
                                       , table : [
                                                   // [ fromState, action, nextState, transition ]
                                                      [ 'none',   'activate', 'active', 'switchON'  ]
                                                    , [ 'active', 'stop',     'none',   'switchOFF' ]
                                                ]
                                        , stateData : { say:'hi' }
                                }
                        ;
                    const fsm = new Fsm ( machine, lib );
    
                    fsm.update ( 'activate' );
                    expect ( fsm.stateData     ).to.have.property ( 'say' )
                    expect ( fsm.stateData.say ).to.be.equal ( 'yo-ho-ho' )

                    fsm.reset ()
                    expect ( fsm.state         ).to.be.equal ( machine.init )
                    expect ( fsm.stateData.say ).to.be.equal ( machine.stateData.say )
                }) // it





            it ( 'GetState', () => {
                    const 
                          lib   = {
                                        switchON ( dependencies, stateData, dt ) {
                                                stateData.say = 'yo-ho-ho'
                                                return { success  : true, stateData }
                                            }
                                        , switchOFF () {
                                                return { success: true }
                                            }
                                }
                        , machine = {
                                         init  : 'none'
                                       , table : [
                                                   // [ fromState, action, nextState, transition ]
                                                      [ 'none',   'activate', 'active', 'switchON'  ]
                                                    , [ 'active', 'stop',     'none',   'switchOFF' ]
                                                ]
                                        , stateData : { say:'hi' }
                                }
                        ;
                    
                    const fsm = new Fsm ( machine, lib );
                    const result = fsm.getState ()

                    expect ( result ).to.be.equal ( 'none' )
                }) // it getState




            it ( 'Command', () => {
                    const 
                          lib   = {
                                        switchON ( dependencies, stateData, dt ) {
                                                stateData.say = 'yo-ho-ho'
                                                return { success : true, command : 'stop', stateData }
                                            }
                                        , switchOFF () {
                                                return { success: true }
                                            }
                                }
                        , machine = {
                                         init  : 'none'
                                       , table : [
                                                   // [ fromState, action, nextState, transition ]
                                                      [ 'none',   'activate', 'active', 'switchON'  ]
                                                    , [ 'active', 'stop',     'none',   'switchOFF' ]
                                                ]
                                        , stateData : { say:'hi' }
                                }
                        ;
                    
                    const fsm = new Fsm ( machine, lib );
                    fsm.update ( 'activate' ) // Transition-function 'switchON' returns command 'stop'. Auto-stop.
                    const r = fsm.getState ();
                    expect ( r ).to.be.equal ( 'none' )
                    expect (fsm.stateData.say).to.be.equal ( 'yo-ho-ho' )
                }) // it command





            it ( 'Missing init', () => {
                    const 
                          lib   = {
                                        switchON ( dependencies, stateData, dt ) {
                                                return { success : true }
                                            }
                                        , switchOFF () {
                                                return { success: true }
                                            }
                                }
                        , machine = {
                                          table : [
                                                   // [ fromState, action, nextState, transition ]
                                                      [ 'none',   'activate', 'active', 'switchON'  ]
                                                    , [ 'active', 'stop',     'none',   'switchOFF' ]
                                                ]
                                }
                        ;
                    const fsm = new Fsm ( machine, lib );
                    fsm.update ( 'activate' )
                    const r = fsm.getState ()

                    expect ( r ).to.be.equal ('N/A')
                }) // it Missing init





            it ( 'Missing lib', () => {
                    const 
                          lib   = {
                                        switchON ( dependencies, stateData, dt ) {
                                                return { success : true }
                                            }
                                        , switchOFF () {
                                                return { success: true }
                                            }
                                }
                        , machine = {
                                          init :  'none'
                                        , table : [
                                                   // [ fromState, action, nextState, transition ]
                                                      [ 'none',   'activate', 'active', 'switchON'  ]
                                                    , [ 'active', 'stop',     'none',   'switchOFF' ]
                                                ]
                                }
                        ;
                    const fsm = new Fsm ( machine );  // Argument 'lib' was forgotten.
                    fsm.update ( 'activate' )
                    const r = fsm.getState ()

                    expect ( r ).to.be.equal ('none')
                }) // it Missing init
}) // describe


