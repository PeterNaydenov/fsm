
import Fsm from '../src/main.js'
import { expect } from 'chai'
import dtbox from 'dt-toolbox'



describe ( 'Finite State Machine', () => {
    


    it ( 'Check FSM structure', done => {
            // SETUP - provide machine description and transition library.
            const 
                    lib   = {
                                switchON ({task}) {
                                        setTimeout ( () => task.done ({ success : true }),   100 ) 
                                    } // switchOn func.
                        }
                  , machine = {
                                 init  : 'none'
                               , behavior : [
                                            // [ fromState, action,  nextState, transition, chainActions(optional)  ]
                                              [ 'none',   'activate', 'active', 'switchON'  ]
                                            , [ 'active', 'stop',     'none',   'switchOFF' ]
                                        ]
                                , debug : true  // creates a global variable 'debugFSM' to inspect fsm structure and states
                          }
                ;

            // Create fsm. Inspect all expected values.
            const fsm = new Fsm ( machine, lib );

            fsm.update ( 'activate' )                 // State from 'none' to 'active'
               .then ( () => fsm.update ( 'stop' ))   // Will not change anything. Transition is not defined
               .then ( () => {
                        expect ( debugFSM.state        ).to.be.equal ( 'active' )
                        const stateData = debugFSM.stateData.model(()=>({as:'std'}));
                        expect ( stateData ).to.be.empty
                        const initStateData = debugFSM.initialStateData.model(()=>({as:'std'}));
                        expect ( initStateData ).to.be.empty
                        
                        expect ( Fsm.dependencies ).to.have.property ( 'askForPromise' )
                        expect ( Fsm.dependencies ).to.have.property ( 'dtbox' )
                        expect ( Fsm.dependencies ).to.have.property ( 'walk' )
            
                        expect ( debugFSM.transitions ).to.have.property ( 'none/activate' )
                        expect ( debugFSM.transitions ).to.have.property ( 'active/stop'   )

                        expect ( debugFSM.transitions['none/activate'] ).to.be.a('function')
                        expect ( debugFSM.transitions['active/stop'] ).to.be.equal(null)
                        
                        expect ( debugFSM.nextState).to.have.property ( 'none/activate' )
                        expect ( debugFSM.nextState).to.have.property ( 'active/stop'   )
            
                        expect ( debugFSM.nextState['none/activate'] ).to.be.equal ( 'active' )
                        expect ( debugFSM.nextState['active/stop'] ).to.be.equal ( 'none' )
                        done ()
                    })
        }) // it minimal working configuration





    it ( 'Default dependencies', () => {
                // SETUP - provide machine description and transition library.
                const 
                        lib   = {
                                    switchON ( {task}) {
                                            setTimeout ( () => task.done ({ success : true }),   100 ) 
                                        } // switchOn func.
                            }
                      , machine = {
                                    init  : 'none'
                                  , behavior : [
                                                // [ fromState, action,  nextState, transition, chainActions(optional)  ]
                                                  [ 'none',   'activate', 'active', 'switchON'  ]
                                                , [ 'active', 'stop',     'none',   'switchOFF' ]
                                            ]
                              }
                    ;
                // Create fsm. Inspect all expected values.
                const 
                        fsm = new Fsm ( machine, lib )
                      , dependencies = fsm.getDependencies ()
                      ;
                expect ( dependencies ).to.have.property ( 'walk' )
                expect ( dependencies ).to.have.property ( 'askForPromise' )
        }) // it default dependencies





    it ( 'Read "stateData" from transition function. Provide update-response.', () => {
        // *** Convert stateData to update-response
            const 
                  lib   = {
                                switchON ({task,extractList}) {
                                        const [ say ] = extractList (['say']);
                                        task.done ({ success : true, response: { say } })
                                    }
                                , switchOFF () {}
                        }
                , machine = {
                                 init  : 'none'
                               , behavior : [
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
                                    switchON ({
                                                  task
                                                , dependencies : { test }
                                              }) {
                                            task.done ({ success  : true, response: test })
                                        }
                                    , switchOFF ({task}) {
                                            task.done ({ success: true })
                                        }
                            }
                    , machine = {
                                     init  : 'none'
                                   , behavior : [
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





    it ( 'Reset ', done => {
                // *** Reset fsm state and stateData
                    const 
                          lib   = {
                                        switchON ({task,extractList}) {
                                                const [ test ] = extractList ([ 'test' ]);
                                                test.say =  'yo-ho-ho'
                                                const name = 'John';
                                                task.done ({ 
                                                            success : true
                                                          , stateData : { test, name } 
                                                        })
                                            }
                                        , switchOFF ( task ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                         init  : 'none'
                                       , behavior : [
                                                    // [ fromState, action,  nextState, transition, chainActions(optional)  ]
                                                      [ 'none',   'activate', 'active', 'switchON'  ]
                                                    , [ 'active', 'stop',     'none',   'switchOFF' ]
                                                ]
                                        , stateData : { 
                                                            name : 'Peter'
                                                          , test: { 
                                                                      say : 'hi' 
                                                                    , owner : {
                                                                                  name : 'Peter'
                                                                                , age  : 49
                                                                                , address : {
                                                                                                city : 'Sofia'
                                                                                              , street : 'Vasil Levski'
                                                                                              , number : 75
                                                                                        }
                                                                          }
                                                                  } 
                                                  }
                                }
                        ;
                    const fsm = new Fsm ( machine, lib );
    
                    fsm.update ( 'activate' )
                         .then ( () => {
                                const [r1, r2, q1] = fsm.extractList ( ['root', 'test', 'name' ]);

                                expect ( fsm.getState() ).to.be.equal ( 'active' )
                                expect ( r1.name ).to.be.equal ( 'John')             // Requesting a 'root' will return object with all primitive state data fields
                                expect ( q1      ).to.be.equal ( 'John' )            // Requesting a prop will returns a primitive value
                                expect ( r2      ).to.have.property ( 'say' )
                                expect ( r2.say  ).to.be.equal ( 'yo-ho-ho' )
                                
                                fsm.reset ()   // Should change 'state' and 'stateData' to initial values
                                expect ( fsm.getState()   ).to.be.equal ( machine.init )
                                const [ r3, r4 ] = fsm.extractList (['root', 'test'])

                                expect ( r3.name ).to.be.equal ( 'Peter' )
                                expect ( r4.say  ).to.be.equal ( 'hi' )
                                done ()
                            })
                }) // it reset





    it ( 'GetState', () => {
                    const 
                          lib   = {
                                        switchON ( {task, dependencies, state } ) {
                                                let stateData = { say : 'yo-ho-ho'}
                                                task.done ({ success  : true, stateData })
                                            }
                                        , switchOFF ( {task} ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                         init  : 'none'
                                       , behavior : [
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




    it ( 'Missing init', done => {
                    const 
                          lib   = {
                                        switchON ( {task} ) {
                                                task.done ({ success : true })
                                            }
                                        , switchOFF ( {task} ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                          behavior : [
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
                                done ()
                            })
                }) // it Missing init





    it ( 'Missing lib', done => {
                    const 
                          lib   = {
                                        switchON ( {task} ) {
                                                task.done ({ success : true })
                                            }
                                        , switchOFF ( {task} ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                          init :  'none'
                                        , behavior : [
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
                                done ()
                            })
                }) // it Missing lib
        



                
    it ( 'Chain-action on failure', done => {
                    const 
                          lib   = {
                                        switchON ( {task} ) {
                                                task.done ({ success : false })
                                            }
                                        , altOn ( {task} ) {
                                                task.done ({success: true})
                                            }
                                        , switchOFF ( {task} ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                          init :  'none'
                                        , behavior : [
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
                                    done ()
                                })
                }) // it Chain-action on failure





    it ( 'Subscribe for "update", "transition", "positive", "negative"', done => {
                    const 
                          lib   = {
                                        switchON ( {task} ) {
                                                task.done ({ success : false })
                                            }
                                        , altOn ( {task} ) {
                                                task.done ({success: true})
                                            }
                                        , switchOFF ( {task} ) {
                                                task.done ({ success: true })
                                            }
                                }
                        , machine = {
                                          init :  'none'
                                        , behavior : [
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
                    done ()
          }) // it Subscribe for "update", "transition", "positive", "negative"
    




    it ( 'Subscribe for update with chainActions', () => { 
                    const 
                          machine = {
                                      init :  'none'
                                    , behavior : [
                                                // [ fromState, action,        nextState,          transition,        chainActions(optional)   ]
                                                  [ 'none'   , 'activate'     , 'active'            , 'switchON'  , [ false, 'useGenerator']   ]
                                                , [ 'none'   , 'useGenerator' , 'alternativeSource' , 'altOn'     ,                            ]
                                                , [ 'active' , 'stop'         , 'none'              , 'switchOFF' ,                            ]
                                            ]
                              }
                          , lib = {
                                        switchOn ( {task, dependencies, state, extractList}, data ) {
                                              task.done ({ success : false, response: 'switchON' })
                                            }
                                      , altOn ( {task, dependencies, state, extractList}, data ) {
                                                task.done ({ success : true, response: 'altON'})
                                            } 
                                  }
                          ;
                        let counter = 0;

                        const fsm = new Fsm ( machine, lib );
                        fsm.on ( 'update', (state, data) => {
                                                    counter ++
                                                    expect ( counter ).to.be.equal ( 1 )
                                })
                        fsm.update ( 'activate' )
          })  // it subscribe for update with chainActions






    it ( 'Multiple updates', done => {
                        const 
                              lib   = {
                                            switchON ( {task, dependencies, state, extractList}, data ) {
                                                    setTimeout ( () => task.done ({ success : true, response:data }), 220 )
                                                }
                                            , altOn ( task ) {
                                                    task.done ({success: true})
                                                }
                                            , switchOFF ( {task, dependencies, state, extractList}, data ) {
                                                    setTimeout ( () => task.done ({ success: true, response: data }), 90 )
                                                }
                                    }
                            , machine = {
                                              init :  'none'
                                            , behavior : [
                                                        // [ fromState, action,        nextState,          transition,        chainActions(optional)   ]
                                                          [ 'none'   , 'activate'     , 'active'            , 'switchON'  , [ false, 'useGenerator']   ]
                                                        , [ 'none'   , 'useGenerator' , 'alternativeSource' , 'altOn'                                  ]
                                                        , [ 'active' , 'stop'         , 'none'              , 'switchOFF'                              ]
                                                    ]
                                    }
                            ;
                        const fsm = new Fsm ( machine, lib );
                        let count = 0;
                        fsm.on ( 'update', ( state, response ) => {
                                    if ( count == 0 ) {
                                          expect ( state ).to.be.equal ( 'active' )
                                          expect ( response ).to.be.equal ( 'try' )
                                          count++
                                          fsm.update ( 'stop', 'second' )
                                      }
                                    else {
                                          expect ( state ).to.be.equal ( 'none' )
                                          expect ( response ).to.be.equal ( 'second' )
                                          done ()
                                      }
                              })
                        fsm.update ( 'activate', 'try' )
          }) // it Multiple updates

    
    
    

    it ( 'Prevent simultaneous updates', done => {
                    const 
                        description = {
                                          init  : 'center'
                                        , behavior : [ 
                                                          [ 'center', 'goLeft', 'left', 'gotoLeft'    ]
                                                        , [ 'center', 'goRight', 'right', 'gotoRight' ]
                                                        , [ 'left'  , 'goRight', 'center', 'failure'  ]
                                                  ]
                                    }
                        , transitions = {
                                  gotoLeft ( {task} ) {
                                            setTimeout ( () => {
                                                    task.done ({ 
                                                                  success : true
                                                                , response  : 'Aloha'
                                                            }) 
                                                }, 300)
                                            }
                                , gotoRight ( {task, dependencies, extractList}, dt ) {
                                            task.done ({
                                                          success : true
                                                        , response  : 'Guten tag'
                                                })
                                        }
                                , failure ( {task, dependencies, extractList}, data ) {
                                            task.done ({
                                                              success : true
                                                            , response : data
                                                    })
                                        }
                            }
                    const 
                          fsm          = new Fsm ( description, transitions )
                        , askForPromise = fsm.getDependencies ().askForPromise
                        , task1        = askForPromise ()
                        , task2        = askForPromise ()
                        , task3        = askForPromise ()
                        ;

                    let resultState = 'none';
                    
                    fsm.update ( 'goLeft' )
                       .then ( r => {
                            expect ( resultState ).to.be.equal ( 'none' )
                            expect ( r ).to.be.equal ( 'Aloha' )
                            resultState = 'left'
                            task1.done ()
                        })
                    fsm.update ( 'goRight', 'right from left' )
                       .then ( r => {
                                const state = fsm.getState ();
                                expect ( resultState ).to.be.equal ( 'left' )
                                expect ( state ).to.be.equal ( 'center' )
                                expect ( r ).to.be.equal ( 'right from left' )
                                resultState = 'center'
                                task2.done ()
                        })
                    fsm.update ( 'goRight' )
                       .then ( r => {
                                const state = fsm.getState ();
                                expect ( resultState ).to.be.equal ( 'center' )
                                expect ( state ).to.be.equal ( 'right' )
                                expect ( r ).to.be.equal ( 'Guten tag' )
                                task3.done ()
                        })
                        
                    Promise.all ([
                                      task1.promise
                                    , task2.promise
                                    , task3.promise
                              ])
                         .then ( () =>  done ()   )
                }) // it prevent simultaneous updates





    it ( 'Export State', done => {
                    const
                          description = {
                                               init : 'none'
                                             , behavior : [
                                                            [ 'none', 'start', 'initial', 'startUp' ]
                                                          , [ 'initial', 'move', 'active', 'fireUp'  ]
                                                       ]
                                            , stateData : { 
                                                              'duringStart' : 'none'
                                                           , 'duringFireUp' : 'none'
                                                        }
                                }
                        , transitions = {
                                            startUp ( {task, dependencies, extractList}, dt ) {
                                                        const 
                                                              duringStart = 'one'
                                                            , test = { name : 'Peter' }
                                                            ; 
                                                        const response = {
                                                                          success : true
                                                                        , stateData : { duringStart, test }
                                                                    }
                                                        task.done ( response )
                                                } // startup func.
                                            , fireUp ( {task, dependencies, extractList}, dt ) {
                                                        const
                                                              duringFireUp = 'second'
                                                            , response = {
                                                                              success : true
                                                                            , stateData : { duringFireUp }
                                                                        }
                                                            ;
                                                        task.done ( response )
                                                } // fireup func.
                               }
                        ;
                    const fsm = new Fsm ( description, transitions );

                    fsm.update ( 'start' )
                       .then ( x => fsm.update ( 'move' ))
                       .then ( x => {
                                    const result = fsm.exportState ();
                                    const [ r1, r2, r3 ] = dtbox
                                                            .load ( result.stateData )
                                                            .extractList (['duringStart', 'duringFireUp', 'test' ], {as:'std'}) 
                                    expect ( r1 ).to.be.equal ( 'one' )
                                    expect ( r2 ).to.be.equal ( 'second' )
                                    expect ( result.state ).to.be.equal ( 'active' )
                                    expect ( r3 ).to.be.null   // null because 'test' is not defined in the machine description
                                    done ()
                            })
               }) // it Export State
            




    it ( 'Import externalState', () => {
                    const
                            description = {
                                              init  : 'none'
                                            , behavior : [
                                                              [ 'none', 'start', 'initial', 'startUp' ]
                                                            , [ 'initial', 'move', 'active', 'fireUp'  ]
                                                        ]
                                            , stateData : { in: false }
                                }
                    const fsm = new Fsm ( description );
                    fsm.importState ( {
                                  state     : 'imported'
                                , stateData : [['root', { in : true }, 'root', []   ]]
                            })
                    
                    expect ( fsm.getState() ).to.be.equal ( 'imported' )
                    const [ r1 ] = fsm.extractList ( ['in'])
                    expect ( r1 ).to.be.true
        }) // it Import externalState





    it ( 'Ignore Cached Updates', done => {
                    const
                              machine = {
                                              init  : 'none'
                                            , behavior : [
                                                              [ 'none', 'start', 'initial', 'startUp' ]
                                                            , [ 'initial', 'move', 'active', 'fireUp'  ]
                                                        ]
                                            , stateData : { 
                                                            yo: 'hi'
                                                          , wrong: false
                                                          }
                                }
                            , transitions = {
                                       startUp ({ task }) {
                                            // Use setTimeout to keep task unresolved for a while.
                                            setTimeout ( () => {
                                                    task.done ({ 
                                                                  success   : true 
                                                                , stateData : { yo:'hello' }
                                                            })
                                                }, 200 )
                                          } // startUp func.
                                    , fireUp ({ task }) {
                                                task.done ({ 
                                                              success : true
                                                            , stateData :  { 'wrong' : true }
                                                        })
                                          } // fireUp func.
                                }
                            ;
                    let result;
                    const fsm = new Fsm ( machine, transitions );
                    /**
                     *   Execution order of fsm commands:
                     *      1. Update 'start';
                     *      2. Update 'move';
                     *      3. Ignore cached 'move';
                     * 
                     * */ 
                    fsm.update ( 'start' ) // -> will call 'startUp' transition
                       .then ( x =>  fsm.ignoreCachedUpdates () )  

                    fsm.update ( 'move' ) // Call next transition before 'startUp' is finished.
                       .then ( x => {   // Positive response
                                          expect ( null ).to.be.equal ( 1 )   // Positive response should not be called.
                                          done ()
                                  }
                              , x => {   //---> ignoreCachedUpdates should move logic here. X will contain error message produced by fsm.
                                          result = fsm.exportState ()
                                          const [ r1, r2 ] = fsm.extractList (['yo', 'wrong'])
                                          expect ( result.state ).to.be.equal ( 'initial' )
                                          expect ( r1 ).to.be.equal ( 'hello' )
                                          expect ( r2 ).to.be.false
                                          expect ( x ).to.be.equal ( "Action 'move' was ignored" )
                                          done ()
                                  })
               }) // it Ignore cached updates





      it ( 'extractList', done => {
                    const
                              machine = {
                                              init  : 'none'
                                            , behavior : [
                                                              [ 'none', 'start', 'initial', 'startUp' ]
                                                            , [ 'initial', 'move', 'active', 'fireUp'  ]
                                                        ]
                                            , stateData : { 
                                                            yo: 'hi'
                                                          , wrong: false
                                                          , deep : { prop: 12, prop2: 'hi' }
                                                          }
                                }
                            , transitions = {
                                       startUp ({ task, extractList }) {
                                            const stateDataExtraction = extractList ();
                                            expect ( stateDataExtraction ).to.be.deep.equal ( machine.stateData )
                                            // Use setTimeout to keep task unresolved for a while.
                                            setTimeout ( () => {
                                                    task.done ({ 
                                                                  success   : true 
                                                                , stateData : { yo:'hello' }
                                                            })
                                                }, 200 )
                                          } // startUp func.
                                    , fireUp ({ task }) {
                                                task.done ({ 
                                                              success : true
                                                            , stateData :  { 'wrong' : true }
                                                        })
                                          } // fireUp func.
                                }
                            ;

                    const fsm = new Fsm ( machine, transitions );
                    fsm.update ( 'start' )
                       .then ( x => {                                
                                expect ( x ).to.be.undefined
                                let stData = fsm.extractList (); // extractList without arguments returns all stateData as a single object.
                                expect ( stData.yo ).to.be.equal ( 'hello' )
                                expect ( stData.wrong ).to.be.false
                                expect ( stData.deep.prop ).to.be.equal ( 12 )
                                expect ( stData.deep.prop2 ).to.be.equal ( 'hi' )
                                done ()
                            })
              }) // it extractList





      it ( 'Change stateData as dt-model and dt-object', done => {
                        const
                              machine = {
                                              init  : 'none'
                                            , behavior : [
                                                              [ 'none', 'start', 'initial', 'startUp' ]
                                                            , [ 'initial', 'move', 'active', 'fireUp'  ]
                                                        ]
                                            , stateData : { 
                                                            yo: 'hi'
                                                          , wrong: false
                                                          , deep : { prop: 12, prop2: 'hi' }
                                                          }
                                }
                            , transitions = {
                                       startUp ({ task, dependencies }) {
                                            // Use setTimeout to keep task unresolved for a while.
                                            const { dtbox } = dependencies;
                                            setTimeout ( () => {
                                                            const deep = { 
                                                                            prop: 'aloha'
                                                                          , prop2: ['startUpdate', 'something', 'more'] 
                                                                    };
                                                            task.done ({ 
                                                                          success   : true 
                                                                        , stateData : dtbox.init({ deep, yo:'hello' }).export() // Checkout dt-model input
                                                                        , response : { 'started': true }
                                                                    })
                                                    }, 200 )
                                          } // startUp func.
                                    , fireUp ({ task, dependencies }) {
                                                const { dtbox } = dependencies;                                      
                                                task.done ({ 
                                                              success : true
                                                            , stateData : dtbox.init ({ 'wrong' : true }) // Checkout dt-object input
                                                        })
                                          } // fireUp func.
                                }
                            ;

                      const fsm = new Fsm ( machine, transitions );
                      fsm.update ( 'start' )
                         .then ( x => {
                                    expect ( x ).to.be.deep.equal ( { started: true } )
                                    let startChanges = fsm.extractList ();

                                    expect ( startChanges.yo ).to.be.equal ( 'hello' )
                                    expect ( startChanges.wrong ).to.be.false
                                    expect ( startChanges.deep.prop ).to.be.equal ( 'aloha' )
                                    expect ( startChanges.deep.prop2 ).to.be.deep.equal ( ['startUpdate', 'something', 'more'] )
                                    expect ( fsm.getState() ).to.be.equal ( 'initial' )
                                    return fsm.update ( 'move' )
                              })
                        .then ( x => {
                                    const moveChanges = fsm.extractList ();
                                    expect ( moveChanges.yo ).to.be.equal ( 'hello' )
                                    expect ( moveChanges.wrong ).to.be.true
                                    expect ( moveChanges.deep.prop ).to.be.equal ( 'aloha' )
                                    expect ( moveChanges.deep.prop2 ).to.be.deep.equal ( ['startUpdate', 'something', 'more'] )
                                    done ()
                              })

              }) // it Change stateData as dt-model and dt-object





      it ( 'ExtractList with options', done => {  
                      const machine = {
                                              init  : 'none'
                                            , behavior : [
                                                              [ 'none', 'start', 'initial', 'startUp' ]
                                                        ]
                                            , stateData : { 
                                                            yo: 'hi'
                                                          , wrong: false
                                                          , deep : { prop: 12, prop2: 'hi', inside: { well: true } }
                                                          }
                                      }
                            , transitions = {
                                       startUp ({ task, extractList }) {
                                                // Use setTimeout to keep task unresolved for a while.
                                                const [ working, deepObject, say ] = extractList([ 'wrong', 'deep', 'yo'], {as: 'tuples'});
                                                expect ( working ).to.be.false   // Primitive values are extracted directly
                                                expect ( deepObject ).to.be.deep.equal ( [ [ 'prop', 12 ], [ 'prop2', 'hi' ], ['inside/well', true ] ] )   // ExtractList options are used 
                                                expect ( say ).to.be.equal ( 'hi' ) 
                                                task.done ({ success   : true })
                                                done ()
                                          } // startUp func.
                                }
                            ;
                      const fsm = new Fsm ( machine, transitions );
                      fsm.update ( 'start' )
          }) // it ExtractList as dt-object

}) // describe


