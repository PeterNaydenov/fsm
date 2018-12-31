
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
                                switchON ( task, dependencies, stateData, dt ) {
                                        setTimeout ( () => task.done ({ success : true }),   100 ) 
                                    } // switchOn func.
                        }
                  , machine = {
                                 init  : 'none'
                               , table : [
                                            // [ fromState, action,  nextState, transition, chainActions(optional)  ]
                                              [ 'none',   'activate', 'active', 'switchON'  ]
                                            , [ 'active', 'stop',     'none',   'switchOFF' ]
                                        ]
                          }
                ;

            // Create fsm. Inspect all expected values.
            const fsm = new Fsm ( machine, lib );
            fsm.update ( 'activate' )                 // State from 'none' to 'active'
               .then ( () => fsm.update ( 'stop' ))   // Will not change anything. Transition is not defined
               .then ( () => {
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
                    })
        }) // it minimal working configuration





        it ( 'Read "stateData" from transition function. Provide update-response.', () => {
        // *** Convert stateData to update-response
            const 
                  lib   = {
                                switchON ( task, dependencies, stateData, dt ) {
                                        task.done ({ success  : true, response: stateData })
                                    }
                                , switchOFF () {}
                        }
                , machine = {
                                 init  : 'none'
                               , table : [
                                            // [ fromState, action,  nextState, transition, chainActions(optional)  ]
                                              [ 'none',   'activate', 'active', 'switchON'  ]
                                            , [ 'active', 'stop',     'none',   'switchOFF' ]
                                        ]
                                , stateData : { say:'hi' }
                        }
                ;
            const fsm = new Fsm ( machine, lib );
            fsm.update ( 'activate' )
               .then ( result => {
                        expect ( result ).to.have.property ( 'say' )
                        expect ( result.say ).to.be.equal ( 'hi' )
                    })
        }) // it Read 'stateData' from transition func.





        it ( 'Use dependencies', () => {
            // *** Convert dependencies to update-response
                const 
                      lib   = {
                                    switchON ( task, dependencies, stateData, dt ) {
                                            const { test } = dependencies;
                                            task.done ({ success  : true, response: test })
                                        }
                                    , switchOFF ( task ) {
                                            task.done ({ success: true })
                                        }
                            }
                    , machine = {
                                     init  : 'none'
                                   , table : [
                                                // [ fromState, action,  nextState, transition, chainActions(optional)  ]
                                                  [ 'none',   'activate', 'active', 'switchON'  ]
                                                , [ 'active', 'stop',     'none',   'switchOFF' ]
                                            ]
                                    , stateData : { say:'hi' }
                            }
                    , test = { say: 'hi'}   // random object that will become a fsm dependency
                    ;
                const fsm = new Fsm ( machine, lib );
                fsm.setDependencies ({test})
                fsm.update ( 'activate' )
                   .then ( result => {
                                expect ( result ).to.have.property ( 'say' )
                                expect ( result.say ).to.be.equal ( 'hi' )
                        })
            }) // it   Use 'dependencies'





            it ( 'Reset ', () => {
                // *** Reset fsm state and stateData
                    const 
                          lib   = {
                                        switchON ( task, dependencies, stateData, dt ) {
                                                stateData.say = 'yo-ho-ho'
                                                task.done ({ success  : true, stateData })
                                            }
                                        , switchOFF ( task ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                         init  : 'none'
                                       , table : [
                                                    // [ fromState, action,  nextState, transition, chainActions(optional)  ]
                                                      [ 'none',   'activate', 'active', 'switchON'  ]
                                                    , [ 'active', 'stop',     'none',   'switchOFF' ]
                                                ]
                                        , stateData : { say:'hi' }
                                }
                        ;
                    const fsm = new Fsm ( machine, lib );
    
                    fsm.update ( 'activate' )
                       .then ( result => {
                                expect ( fsm.stateData     ).to.have.property ( 'say' )
                                expect ( fsm.stateData.say ).to.be.equal ( 'yo-ho-ho' )
    
                                fsm.reset ()
                                expect ( fsm.state         ).to.be.equal ( machine.init )
                                expect ( fsm.stateData.say ).to.be.equal ( machine.stateData.say )
                            })
                }) // it reset





            it ( 'GetState', () => {
                    const 
                          lib   = {
                                        switchON ( task, dependencies, stateData, dt ) {
                                                stateData.say = 'yo-ho-ho'
                                                task.done ({ success  : true, stateData })
                                            }
                                        , switchOFF ( task ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                         init  : 'none'
                                       , table : [
                                                    // [ fromState, action,  nextState, transition, chainActions(optional)  ]
                                                      [ 'none',   'activate', 'active', 'switchON'  ]
                                                    , [ 'active', 'stop',     'none',   'switchOFF' ]
                                                ]
                                        , stateData : { say:'hi' }
                                }
                        ;
                    
                    const 
                          fsm    = new Fsm ( machine, lib )
                        , result = fsm.getState ()
                        ;
                    expect ( result ).to.be.equal ( 'none' )
                }) // it getState




            it ( 'Command', () => {
                    const 
                          lib   = {
                                        switchON ( task, dependencies, stateData, dt ) {
                                                stateData.say = 'yo-ho-ho'
                                                task.done ({ success : true, command : 'stop', stateData })
                                            }
                                        , switchOFF ( task ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                         init  : 'none'
                                       , table : [
                                                    // [ fromState, action,  nextState, transition, chainActions(optional)  ]
                                                      [ 'none',   'activate', 'active', 'switchON'  ]
                                                    , [ 'active', 'stop',     'none',   'switchOFF' ]
                                                ]
                                        , stateData : { say:'hi' }
                                }
                        ;
                    
                    const fsm = new Fsm ( machine, lib );
                    fsm.update ( 'activate' ) // Transition-function 'switchON' returns command 'stop'. Auto-stop.
                       .then ( result => {
                                    const r = fsm.getState ();
                                    expect ( r ).to.be.equal ( 'none' )
                                    expect (fsm.stateData.say).to.be.equal ( 'yo-ho-ho' )
                           })
                }) // it command





            it ( 'Missing init', () => {
                    const 
                          lib   = {
                                        switchON ( task, dependencies, stateData, dt ) {
                                                task.done ({ success : true })
                                            }
                                        , switchOFF ( task ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                          table : [
                                                    // [ fromState, action,  nextState, transition, chainActions(optional)  ]
                                                      [ 'none',   'activate', 'active', 'switchON'  ]
                                                    , [ 'active', 'stop',     'none',   'switchOFF' ]
                                                ]
                                }
                        ;
                    const fsm = new Fsm ( machine, lib );
                    fsm.update ( 'activate' )
                       .then ( () => {
                                const r = fsm.getState ();
                                expect ( r ).to.be.equal ( 'N/A' )
                            })
                }) // it Missing init





            it ( 'Missing lib', () => {
                    const 
                          lib   = {
                                        switchON ( task, dependencies, stateData, dt ) {
                                                task.done ({ success : true })
                                            }
                                        , switchOFF ( task ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                          init :  'none'
                                        , table : [
                                                    // [ fromState, action,  nextState, transition, chainActions(optional)  ]
                                                      [ 'none',   'activate', 'active', 'switchON'  ]
                                                    , [ 'active', 'stop',     'none',   'switchOFF' ]
                                                ]
                                }
                        ;
                    const fsm = new Fsm ( machine );  // Argument 'lib' was forgotten.
                    fsm.update ( 'activate' )
                       .then ( () => {
                                const r = fsm.getState ();
                                expect ( r ).to.be.equal ( 'none' )
                            })
                }) // it Missing lib
        



                
            it ( 'Chain-action on failure', () => {
                    const 
                          lib   = {
                                        switchON ( task, dependencies, stateData, dt ) {
                                                task.done ({ success : false })
                                            }
                                        , altOn ( task ) {
                                                task.done ({success: true})
                                            }
                                        , switchOFF ( task ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                          init :  'none'
                                        , table : [
                                                    // [ fromState, action,        nextState,          transition,        chainActions(optional)   ]
                                                      [ 'none'   , 'activate'     , 'active'            , 'switchON'  , [ false, 'useGenerator']   ]
                                                    , [ 'none'   , 'useGenerator' , 'alternativeSource' , 'altOn'     ,                            ]
                                                    , [ 'active' , 'stop'         , 'none'              , 'switchOFF' ,                            ]
                                                ]
                                }
                        ;
                    const fsm = new Fsm ( machine, lib );
                    fsm.update ( 'activate' )
                       .then ( 
                            () => {
                                    const r = fsm.getState ();
                                    expect ( r ).to.be.equal ( 'alternativeSource' )
                                })
                }) // it Chain-action on failure





            it ( 'Subscribe for "update", "transition", "positive", "negative"', () => {
                    const 
                          lib   = {
                                        switchON ( task, dependencies, stateData, dt ) {
                                                task.done ({ success : false })
                                            }
                                        , altOn ( task ) {
                                                task.done ({success: true})
                                            }
                                        , switchOFF ( task ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                          init :  'none'
                                        , table : [
                                                    // [ fromState, action,        nextState,          transition,        chainActions(optional)   ]
                                                      [ 'none'   , 'activate'     , 'active'            , 'switchON'  , [ false, 'useGenerator']   ]
                                                    , [ 'none'   , 'useGenerator' , 'alternativeSource' , 'altOn'     ,                            ]
                                                    , [ 'active' , 'stop'         , 'none'              , 'switchOFF' ,                            ]
                                                ]
                                }
                        ;
                    const fsm = new Fsm ( machine, lib );
                    let count = 0;
                    fsm.on ( 'negative', state => {
                                expect ( state ).to.be.equal ( 'none' )
                         })
                    fsm.on ( 'transition', ( state, response) => {
                                if ( count == 0 )   expect ( state ).to.be.equal ( 'none'              )
                                else                expect ( state ).to.be.equal ( 'alternativeSource' )
                                count++
                          })
                    fsm.on ( 'positive', ( state, response) => {
                                expect ( state ).to.be.equal ( 'alternativeSource' )
                          })
                    fsm.on ( 'update', ( state, response ) => {
                                expect ( state ).to.be.equal ( 'alternativeSource' )
                          })
                    fsm.update ( 'activate' )
                }) // it Alt action on failure
    
    
    
    
    
            it ( 'Prevent simultaneous updates', () => {
                    const 
                        description = {
                                          init  : 'center'
                                        , table : [ 
                                                          [ 'center', 'goLeft', 'left', 'gotoLeft'    ]
                                                        , [ 'center', 'goRight', 'right', 'gotoRight' ]
                                                        , [ 'left'  , 'goRight', 'center', 'failure'  ]
                                                  ]
                                    }
                        , transitions = {
                                  gotoLeft ( task ) {
                                            setTimeout ( () => {
                                                    task.done ({ 
                                                                  success : true
                                                                , response  : 'Aloha'
                                                            }) 
                                                }, 300)
                                            }
                                , gotoRight ( task, dependencies, stateData, dt ) {
                                            task.done ({
                                                          success : true
                                                        , response  : 'Guten tag'
                                                })
                                        }
                                , failure ( task, dependencies, stateData, dt ) {
                                            task.done ({
                                                              success : true
                                                            , response : dt
                                                    })
                                        }
                            }
                    const fsm = new Fsm ( description, transitions );

                    let resultState = 'none';
                    
                    fsm.update ( 'goLeft' ).then ( r => {
                            expect ( resultState ).to.be.equal ( 'none' )
                            expect ( r ).to.be.equal ( 'Aloha' )
                            resultState = 'left'
                        })
                    fsm.update ( 'goRight', 'right from left' ).then ( r => {
                                const state = fsm.getState ();
                                expect ( resultState ).to.be.equal ( 'left' )
                                expect ( state ).to.be.equal ( 'center' )
                                expect ( r ).to.be.equal ( 'right from left' )
                                expect ( fsm.cache ).to.have.length ( 0 )
                                resultState = 'center'
                        })
                    fsm.update ( 'goRight' ).then ( r => {
                                const state = fsm.getState ();
                                expect ( resultState ).to.be.equal ( 'center' )
                                expect ( state ).to.be.equal ( 'right' )
                                expect ( r ).to.be.equal ( 'Guten tag' )
                        })
                }) // it prevent simultaneous updates
}) // describe


