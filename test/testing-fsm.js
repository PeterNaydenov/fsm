import Fsm from '../src/main.js'
import { describe, it, expect } from 'vitest'
import dtbox from 'dt-toolbox'



describe ( 'Finite State Machine', () => {



    it ( 'Check FSM structure', async () => {
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

            await fsm.update ( 'activate' )                 // State from 'none' to 'active'
            await fsm.update ( 'stop' )                     // Will not change anything. Transition is not defined

            expect ( debugFSM.state        ).toBe ( 'active' )
            const stateData = debugFSM.stateData.model(()=>({as:'std'}));
            expect ( stateData ).toEqual ( {} )
            const initStateData = debugFSM.initialStateData.model(()=>({as:'std'}));
            expect ( initStateData ).toEqual ( {} )

            expect ( Fsm.dependencies ).toHaveProperty ( 'askForPromise' )
            expect ( Fsm.dependencies ).toHaveProperty ( 'dtbox' )
            expect ( Fsm.dependencies ).toHaveProperty ( 'walk' )

            expect ( debugFSM.transitions ).toHaveProperty ( 'none/activate' )
            expect ( debugFSM.transitions ).toHaveProperty ( 'active/stop'   )

            expect ( debugFSM.transitions['none/activate'] ).toBeTypeOf ( 'function' )
            expect ( debugFSM.transitions['active/stop'] ).toBeNull ()

            expect ( debugFSM.nextState).toHaveProperty ( 'none/activate' )
            expect ( debugFSM.nextState).toHaveProperty ( 'active/stop'   )

            expect ( debugFSM.nextState['none/activate'] ).toBe ( 'active' )
            expect ( debugFSM.nextState['active/stop'] ).toBe ( 'none' )
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
                expect ( dependencies ).toHaveProperty ( 'walk' )
                expect ( dependencies ).toHaveProperty ( 'askForPromise' )
        }) // it default dependencies






    it ( 'Read "stateData" from transition function. Provide update-response.', async () => {
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
            const result = await fsm.update ( 'activate' )
            expect ( result ).toHaveProperty ( 'say' )
            expect ( result.say ).toBe ( 'hi' )
        }) // it Read 'stateData' from transition func.







    it ( 'Use dependencies', async () => {
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
                const result = await fsm.update ( 'activate' )
                expect ( result ).toHaveProperty ( 'say' )
                expect ( result.say ).toBe ( 'hi' )
            }) // it   Use 'dependencies'






    it ( 'Reset ', async () => {
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

                    await fsm.update ( 'activate' )

                    const [r1, r2, q1] = fsm.extractList ( ['root', 'test', 'name' ]);

                    expect ( fsm.getState() ).toBe ( 'active' )
                    expect ( r1.name ).toBe ( 'John')             // Requesting a 'root' will return object with all primitive state data fields
                    expect ( q1      ).toBe ( 'John' )            // Requesting a prop will returns a primitive value
                    expect ( r2      ).toHaveProperty ( 'say' )
                    expect ( r2.say  ).toBe ( 'yo-ho-ho' )

                    fsm.reset ()   // Should change 'state' and 'stateData' to initial values
                    expect ( fsm.getState()   ).toBe ( machine.init )
                    const [ r3, r4 ] = fsm.extractList (['root', 'test'])

                    expect ( r3.name ).toBe ( 'Peter' )
                    expect ( r4.say  ).toBe ( 'hi' )
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
                    expect ( result ).toBe ( 'none' )
                }) // it getState






    it ( 'Missing init', async () => {
                    const
                          lib   = {
                                        switchON ( {task} ) {
                                                task.done ({ success : true })
                                            }
                                        , switchOFF ( {task} ) {
                                                task.done ({ success : true })
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
                    await fsm.update ( 'activate' )

                    const r = fsm.getState ();
                    expect ( r ).toBe ( 'N/A' )
                }) // it Missing init






    it ( 'Missing lib', async () => {
                    const
                          lib   = {
                                        switchON ( {task} ) {
                                                task.done ({ success : true })
                                            }
                                        , switchOFF ( {task} ) {
                                                task.done ({ success : true })
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
                    await fsm.update ( 'activate' )

                    const r = fsm.getState ();
                    expect ( r ).toBe ( 'none' )
                }) // it Missing lib








    it ( 'Chain-action on failure', async () => {
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
                    await fsm.update ( 'activate' )

                    const r = fsm.getState ();
                    expect ( r ).toBe ( 'alternativeSource' )
                }) // it Chain-action on failure






    it ( 'Subscribe for "update", "transition", "positive", "negative"', async () => {
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
                                expect ( state ).toBe ( 'none' )
                         })
                    fsm.on ( 'transition', ( state, response) => {
                                if ( count == 0 )   expect ( state ).toBe ( 'none'              )
                                else                expect ( state ).toBe ( 'alternativeSource' )
                                count++
                          })
                    fsm.on ( 'positive', ( state, response) => {
                                expect ( state ).toBe ( 'alternativeSource' )
                          })
                    fsm.on ( 'update', ( state, response ) => {
                                expect ( state ).toBe ( 'alternativeSource' )
                          })
                    await fsm.update ( 'activate' )
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
                                                    expect ( counter ).toBe ( 1 )
                                })
                        return fsm.update ( 'activate' )
          })  // it subscribe for update with chainActions






    it ( 'Multiple updates', async () => {
                        const
                              lib   = {
                                            switchON ( {task, dependencies, state, extractList}, data ) {
                                                    setTimeout ( () => task.done ({ success : true, response:data }), 220 )
                                                }
                                            , altOn ( task ) {
                                                    task.done ({success: true})
                                                }
                                            , switchOFF ( {task, dependencies, state, extractList}, data ) {
                                                    setTimeout ( () => task.done ({ success : true, response: data }), 90 )
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
                                          expect ( state ).toBe ( 'active' )
                                          expect ( response ).toBe ( 'try' )
                                          count++
                                          fsm.update ( 'stop', 'second' )
                                      }
                                    else {
                                          expect ( state ).toBe ( 'none' )
                                          expect ( response ).toBe ( 'second' )
                                      }
                              })
                        await fsm.update ( 'activate', 'try' )
          }) // it Multiple updates






    it ( 'Prevent simultaneous updates', async () => {
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

                    const updates = [
                          fsm.update ( 'goLeft' )
                             .then ( r => {
                                    expect ( resultState ).toBe ( 'none' )
                                    expect ( r ).toBe ( 'Aloha' )
                                    resultState = 'left'
                                    task1.done ()
                                })
                        , fsm.update ( 'goRight', 'right from left' )
                             .then ( r => {
                                    const state = fsm.getState ();
                                    expect ( resultState ).toBe ( 'left' )
                                    expect ( state ).toBe ( 'center' )
                                    expect ( r ).toBe ( 'right from left' )
                                    resultState = 'center'
                                    task2.done ()
                                })
                        , fsm.update ( 'goRight' )
                             .then ( r => {
                                    const state = fsm.getState ();
                                    expect ( resultState ).toBe ( 'center' )
                                    expect ( state ).toBe ( 'right' )
                                    expect ( r ).toBe ( 'Guten tag' )
                                    task3.done ()
                                })
                        ]

                    await Promise.all ( updates )
                }) // it prevent simultaneous updates






    it ( 'Export State', async () => {
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

                    await fsm.update ( 'start' )
                    await fsm.update ( 'move' )

                    const result = fsm.exportState ();
                    const [ r1, r2, r3 ] = dtbox
                                            .load ( result.stateData )
                                            .extractList (['duringStart', 'duringFireUp', 'test' ], {as:'std'})
                    expect ( r1 ).toBe ( 'one' )
                    expect ( r2 ).toBe ( 'second' )
                    expect ( result.state ).toBe ( 'active' )
                    expect ( r3 ).toBeNull ()   // null because 'test' is not defined in the machine description
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

                    expect ( fsm.getState() ).toBe ( 'imported' )
                    const [ r1 ] = fsm.extractList ( ['in'])
                    expect ( r1 ).toBe ( true )
        }) // it Import externalState






    it ( 'Ignore Cached Updates', async () => {
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

                    try {
                        await fsm.update ( 'move' ) // Call next transition before 'startUp' is finished.
                        // Positive response should not be called.
                        expect ( null ).toBe ( 1 )
                    }
                    catch (x) {   //---> ignoreCachedUpdates should move logic here. X will contain error message produced by fsm.
                                          result = fsm.exportState ()
                                          const [ r1, r2 ] = fsm.extractList (['yo', 'wrong'])
                                          expect ( result.state ).toBe ( 'initial' )
                                          expect ( r1 ).toBe ( 'hello' )
                                          expect ( r2 ).toBe ( false )
                                          expect ( x ).toBe ( "Action 'move' was ignored" )
                                  }
               }) // it Ignore cached updates






      it ( 'extractList', async () => {
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
                                            expect ( stateDataExtraction ).toEqual ( machine.stateData )
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
                    await fsm.update ( 'start' )

                    let stData = fsm.extractList (); // extractList without arguments returns all stateData as a single object.
                    expect ( stData.yo ).toBe ( 'hello' )
                    expect ( stData.wrong ).toBe ( false )
                    expect ( stData.deep.prop ).toBe ( 12 )
                    expect ( stData.deep.prop2 ).toBe ( 'hi' )
              }) // it extractList






      it ( 'Change stateData as dt-model and dt-object', async () => {
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
                                                                          , prop2 : ['startUpdate', 'something', 'more']
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
                      const result1 = await fsm.update ( 'start' )
                      expect ( result1 ).toEqual ( { started: true } )
                      let startChanges = fsm.extractList ();

                      expect ( startChanges.yo ).toBe ( 'hello' )
                      expect ( startChanges.wrong ).toBe ( false )
                      expect ( startChanges.deep.prop ).toBe ( 'aloha' )
                      expect ( startChanges.deep.prop2 ).toEqual ( ['startUpdate', 'something', 'more'] )
                      expect ( fsm.getState() ).toBe ( 'initial' )

                      const result2 = await fsm.update ( 'move' )
                      const moveChanges = fsm.extractList ();
                      expect ( moveChanges.yo ).toBe ( 'hello' )
                      expect ( moveChanges.wrong ).toBe ( true )
                      expect ( moveChanges.deep.prop ).toBe ( 'aloha' )
                      expect ( moveChanges.deep.prop2 ).toEqual ( ['startUpdate', 'something', 'more'] )

              }) // it Change stateData as dt-model and dt-object






      it ( 'ExtractList with options', async () => {
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
                                                expect ( working ).toBe ( false )   // Primitive values are extracted directly
                                                expect ( deepObject ).toEqual ( [ [ 'prop', 12 ], [ 'prop2', 'hi' ], ['inside/well', true ] ] )   // ExtractList options are used
                                                expect ( say ).toBe ( 'hi' )
                                                task.done ({ success   : true })
                                          } // startUp func.
                                }
                            ;
                      const fsm = new Fsm ( machine, transitions );
                      await fsm.update ( 'start' )
          }) // it ExtractList as dt-object






    // =====================================================================
    // BUG REGRESSIONS
    // =====================================================================
    //
    // Both of the following are real bugs that have been fixed. They stay
    // as regression tests so the contract can't silently drift back.

    describe ( 'Bug regressions', () => {

        // -----------------------------------------------------------------
        // BUG 1 — _isAltValid had a tautological check.
        //
        // Original code:
        //     alt.forEach ( m => {
        //         if ( m !== false ||  typeof m != 'string' )    return false
        //     })
        //     return true
        //
        // `forEach` ignores the callback's return value, so the inner
        // `return false` was a no-op and the function always returned
        // `true` for any 2-element array. As a result, an alt like
        // `[null, "useGenerator"]` was accepted, the chain action
        // `["none/activate"]` got registered with `[null, "useGenerator"]`,
        // and when the negative branch fired `_updateStep` would try to
        // dispatch an action whose name is `null` — silently broken
        // (the lookup would just miss, no transition would run).
        //
        // The fix uses `every()` and a single valid-element predicate.
        // A 2-element array whose elements are all `string | false` is
        // valid; anything else is not.
        // -----------------------------------------------------------------
        it ( 'rejects alt with [null, "actionName"] (BUG 1)', () => {
            const fsm = new Fsm ({
                                init : 'none'
                            ,   behavior : [
                                            // [null, "useGen"] should be invalid:
                                            // index 0 is `null`, not a string and not `false`.
                                              [ 'none', 'activate', 'active', 'switchON', [ null, 'useGenerator' ] ]
                                            , [ 'none', 'useGenerator', 'alt', 'altOn' ]
                                        ]
                            ,   debug : true   // gives us debugFSM to inspect chainActions
                        }, {
                                switchON ({task}) { task.done ({ success : true }) }
                            ,   altOn    ({task}) { task.done ({ success : true }) }
                        });

                // chainActions['none/activate'] must NOT exist because the
                // alt row was malformed. Before the fix it was created
                // with value [null, 'useGenerator'].
                expect ( fsm_chainActions_of ( fsm, 'none/activate' ) )
                    .toBe ( undefined )
        }) // it BUG 1 — null

        it ( 'rejects alt with [123, "actionName"] (BUG 1)', () => {
            const fsm = new Fsm ({
                                init : 'none'
                            ,   behavior : [
                                              [ 'none', 'activate', 'active', 'switchON', [ 123, 'useGenerator' ] ]
                                            , [ 'none', 'useGenerator', 'alt', 'altOn' ]
                                        ]
                            ,   debug : true
                        }, {
                                switchON ({task}) { task.done ({ success : true }) }
                            ,   altOn    ({task}) { task.done ({ success : true }) }
                        });
                expect ( fsm_chainActions_of ( fsm, 'none/activate' ) ).toBe ( undefined )
        }) // it BUG 1 — number

        it ( 'rejects alt with [{}, "actionName"] (BUG 1)', () => {
            const fsm = new Fsm ({
                                init : 'none'
                            ,   behavior : [
                                              [ 'none', 'activate', 'active', 'switchON', [ {}, 'useGenerator' ] ]
                                            , [ 'none', 'useGenerator', 'alt', 'altOn' ]
                                        ]
                            ,   debug : true
                        }, {
                                switchON ({task}) { task.done ({ success : true }) }
                            ,   altOn    ({task}) { task.done ({ success : true }) }
                        });
                expect ( fsm_chainActions_of ( fsm, 'none/activate' ) ).toBe ( undefined )
        }) // it BUG 1 — object

        it ( 'rejects alt with [true, "actionName"] (BUG 1)', () => {
            // `true` is truthy and not a string — should be rejected.
            const fsm = new Fsm ({
                                init : 'none'
                            ,   behavior : [
                                              [ 'none', 'activate', 'active', 'switchON', [ true, 'useGenerator' ] ]
                                            , [ 'none', 'useGenerator', 'alt', 'altOn' ]
                                        ]
                            ,   debug : true
                        }, {
                                switchON ({task}) { task.done ({ success : true }) }
                            ,   altOn    ({task}) { task.done ({ success : true }) }
                        });
                expect ( fsm_chainActions_of ( fsm, 'none/activate' ) ).toBe ( undefined )
        }) // it BUG 1 — true

        it ( 'rejects alt that is not an array (BUG 1)', () => {
            const fsm = new Fsm ({
                                init : 'none'
                            ,   behavior : [
                                              [ 'none', 'activate', 'active', 'switchON', 'useGenerator' ]   // a string, not an array
                                            , [ 'none', 'useGenerator', 'alt', 'altOn' ]
                                        ]
                            ,   debug : true
                        }, {
                                switchON ({task}) { task.done ({ success : true }) }
                            ,   altOn    ({task}) { task.done ({ success : true }) }
                        });
                expect ( fsm_chainActions_of ( fsm, 'none/activate' ) ).toBe ( undefined )
        }) // it BUG 1 — non-array alt

        it ( 'rejects alt that is the wrong length (BUG 1)', () => {
            const fsm = new Fsm ({
                                init : 'none'
                            ,   behavior : [
                                              [ 'none', 'activate', 'active', 'switchON', [ 'useGenerator' ] ]   // length 1
                                            , [ 'none', 'useGenerator', 'alt', 'altOn' ]
                                        ]
                            ,   debug : true
                        }, {
                                switchON ({task}) { task.done ({ success : true }) }
                            ,   altOn    ({task}) { task.done ({ success : true }) }
                        });
                expect ( fsm_chainActions_of ( fsm, 'none/activate' ) ).toBe ( undefined )
        }) // it BUG 1 — wrong length

        it ( 'accepts valid alt [false, "actionName"] (BUG 1 — positive case)', () => {
            const fsm = new Fsm ({
                                init : 'none'
                            ,   behavior : [
                                              [ 'none', 'activate', 'active', 'switchON', [ false, 'useGenerator' ] ]
                                            , [ 'none', 'useGenerator', 'alt', 'altOn' ]
                                        ]
                            ,   debug : true
                        }, {
                                switchON ({task}) { task.done ({ success : true }) }
                            ,   altOn    ({task}) { task.done ({ success : true }) }
                        });
                // Valid alt is registered. [0] is `false` (no positive
                // chain), [1] is the action name for the negative chain.
                const entry = fsm_chainActions_of ( fsm, 'none/activate' )
                expect ( Array.isArray ( entry ) ).toBe ( true )
                expect ( entry[0] ).toBe ( false )
                expect ( entry[1] ).toBe ( 'useGenerator' )
        }) // it BUG 1 — valid

        it ( 'accepts valid alt ["actionA", "actionB"] (BUG 1 — both branches)', () => {
            const fsm = new Fsm ({
                                init : 'none'
                            ,   behavior : [
                                              [ 'none', 'activate', 'active', 'switchON', [ 'chainA', 'chainB' ] ]
                                            , [ 'none', 'chainA', 'aState', 'onA' ]
                                            , [ 'none', 'chainB', 'bState', 'onB' ]
                                        ]
                            ,   debug : true
                        }, {
                                switchON ({task}) { task.done ({ success : true }) }
                            ,   onA      ({task}) { task.done ({ success : true }) }
                            ,   onB      ({task}) { task.done ({ success : true }) }
                        });
                const entry = fsm_chainActions_of ( fsm, 'none/activate' )
                expect ( entry[0] ).toBe ( 'chainA' )
                expect ( entry[1] ).toBe ( 'chainB' )
        }) // it BUG 1 — both branches

        // -----------------------------------------------------------------
        // BUG 2 — _updateStateData mis-detected objects with a truthy
        // `export` property as dt-objects.
        //
        // Original code:
        //     if ( updateObject.export )   updateType = 'dt-object'
        //
        // A transition that legitimately returns e.g. `{ export: 'csv' }`
        // (any truthy `export` key) was being routed through the dt-object
        // path, which calls `dtbox.load(updateObject).query(...)`. Plain
        // JS objects don't have `.query()` — TypeError: undefined is not
        // a function. The state update silently failed.
        //
        // The fix checks `typeof updateObject.export === 'function'`,
        // which only matches a real dt-object.
        // -----------------------------------------------------------------
        it ( 'accepts an updateObject with a truthy non-function "export" property (BUG 2)', async () => {
                // A common case: the user happens to have a top-level
                // property called `export` on the patch (e.g. exporting a
                // file, an "export" flag in the data). The library must
                // NOT misdetect this as a dt-object.
                const
                      lib = {
                                switchON ({ task, extractList, dependencies }) {
                                        const update = {
                                              export     : 'csv-format'      // truthy, but not a function
                                            , existing   : 'after'           // updates the existing field
                                        };
                                        task.done ({
                                              success   : true
                                            , stateData : update
                                        })
                                    }
                            }
                    , machine = {
                                  init : 'none'
                                , behavior : [
                                              [ 'none', 'activate', 'active', 'switchON' ]
                                            ]
                                , stateData : { existing: 'before' }
                            }
                    ;
                const fsm = new Fsm ( machine, lib );
                await fsm.update ( 'activate' )

                // The update succeeded and the existing
                // field is updated. Before the fix, this
                // would have thrown inside `_updateStateData`
                // ("updateObject.query is not a function")
                // and the state would never have been
                // touched.
                const r = fsm.extractList (['existing']);
                expect ( r[0] ).toBe ( 'after' )
        }) // it BUG 2 — truthy non-function export

        it ( 'still detects a real dt-object (BUG 2 — positive case)', async () => {
                // A real dt-object exposes `.export()` and `.query()`.
                // Make sure the type detection still works after the fix.
                const
                      lib = {
                                switchON ({ task, extractList, dependencies }) {
                                        const { dtbox } = dependencies;
                                        const update = dtbox.init ({ existing: 'from-dt-object' });
                                        task.done ({
                                              success   : true
                                            , stateData : update
                                        })
                                    }
                            }
                    , machine = {
                                  init : 'none'
                                , behavior : [
                                              [ 'none', 'activate', 'active', 'switchON' ]
                                            ]
                                , stateData : { existing: 'before' }
                            }
                    ;
                const fsm = new Fsm ( machine, lib );
                await fsm.update ( 'activate' )

                const r = fsm.extractList (['existing']);
                expect ( r[0] ).toBe ( 'from-dt-object' )
        }) // it BUG 2 — real dt-object

    }) // describe Bug regressions


}) // describe


// Helper: read `fsm.chainActions[key]` from the fsm instance behind the
// public API. The public `new Fsm(...)` returns the api object, but the
// private storage is on the fsm instance — accessed here via the `api`
// methods. We expose it through the `debug` mode global.
function fsm_chainActions_of ( fsm, key ) {
        // The `fsm` argument is the value returned by `new Fsm(...)`, i.e.
        // the api object. When the machine has `debug: true`, the
        // constructor stashes the full fsm instance on the global
        // `debugFSM`. We just look it up.
        return globalThis.debugFSM.chainActions[key]
}