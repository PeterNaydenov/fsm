import askForPromise  from 'ask-for-promise'    // Docs: https://github.com/PeterNaydenov/ask-for-promise
import dtbox from 'dt-toolbox'                  // Docs: https://github.com/PeterNaydenov/dt-toolbox
import { 
      splitSegments
    , joinSegments
    , updateState 
       } from '@peter.naydenov/dt-queries'     // Docs: https://github.com/PeterNaydenov/dt-queries
import methods from './methods/index.js'

/**
 * A pair of action names for successful and unsuccessful transitions.
 * Use `false` to disable either branch. Empty action names do not trigger a chain.
 * @typedef {[string|false, string|false]} ChainActions
 */

/**
 * One behavior-table row: current state, action, next state, transition-library
 * key, and optional chaining actions. For duplicate state/action keys, the last
 * row supplies the function and destination; the last valid chaining pair is retained.
 * @typedef {[string, string, string, string, ChainActions?]} BehaviorRow
 */

/**
 * Modeling options passed to dt-toolbox when extracting state-data segments.
 * Primitive values are returned directly, regardless of the selected format.
 * @typedef {Object} StateDataFormat
 * @property {string} as - dt-toolbox format, such as 'std', 'tuples', 'dt-model',
 * or 'dt-object'.
 */

/**
 * A dt-toolbox model row: name, flat data, breadcrumbs, and parent/child links.
 * @typedef {[string, Record<string, *>|Array<*>, string, Array<[string, string]>]} DtLine
 */

/**
 * Exported dt-toolbox representation returned by `exportState().stateData`.
 * @typedef {Array<DtLine>} DtModel
 */

/**
 * The portion of the dt-toolbox object API used by this library.
 * @typedef {Object} DtObject
 * @property {(fn: Function, ...args: any[]) => DtObject} query - Apply a query to the model.
 * @property {(segment?: string) => DtModel} export - Export the whole model or a segment.
 * @property {(fn: Function, ...args: any[]) => any} model - Convert selected data to a format.
 * @property {(segments: Array<string>, options?: StateDataFormat) => Array<any>} extractList - Extract values.
 */

/**
 * A patch for existing state-data fields. New top-level fields are ignored.
 * @typedef {Record<string, *>|DtModel|DtObject} StateDataUpdate
 */

/**
 * Machine configuration. State-data keys define the fields transitions may update.
 * @typedef {Object} FsmDefinition
 * @property {string} [init='N/A'] - Initial state; falsy values fall back to 'N/A'.
 * @property {Array<BehaviorRow>} behavior - State/action rules; an empty table is valid.
 * @property {Record<string, *>} [stateData={}] - Initial state-data fields and segments.
 * @property {boolean} [debug=false] - Log missing transitions and expose the internal
 * machine as `global.debugFSM` in environments that provide `global`.
 * @property {StateDataFormat} [stateDataFormat={as:'std'}] - Default extraction format.
 */

/**
 * Overloaded state-data reader: a request list returns a list, while a call
 * without arguments returns the complete standard object.
 * @typedef {((requestedSegments: Array<string>, options?: StateDataFormat|false) => Array<*>) & (() => Record<string, *>)} ExtractList
 */

/**
 * The portion of the dt-toolbox factory API used by this library.
 * @typedef {Object} DtToolbox
 * @property {(data: any, options?: {model?: string}) => (DtObject|null)} init - Initialize data.
 * @property {(data: DtModel) => DtObject} load - Load an exported model.
 * @property {Function} flat - Convert data to a model.
 * @property {Function} convert - Convert data between supported formats.
 * @property {() => Function} getWalk - Get the tree walker.
 */

/**
 * Built-in dependencies available to transitions.
 * @typedef {Object} BuiltinDependencies
 * @property {Function} walk - dt-toolbox's tree walker.
 * @property {DtToolbox} dtbox - Data-model utilities.
 * @property {typeof askForPromise} askForPromise - Promise-task factory.
 * @property {{splitSegments: Function, joinSegments: Function,
 * updateState: Function}} query - State-data queries.
 */

/**
 * Built-in dependencies plus any values supplied through `setDependencies()`.
 * @typedef {BuiltinDependencies & Record<string, *>} Dependencies
 */

/**
 * An ask-for-promise task. Transitions finish by calling `done(TransitionResult)`;
 * update tasks finish with the final transition's response.
 * @typedef {import('ask-for-promise').AskObject} Task
 */

/**
 * Result supplied to a transition's `task.done()`.
 * @typedef {Object} TransitionResult
 * @property {boolean} success - Whether to enter the configured next state.
 * @property {StateDataUpdate} [stateData] - Patch applied only on success.
 * @property {*} [response] - Value passed to callbacks, the next chained action,
 * and, for the final step, the promise returned by `update()`.
 */

/**
 * @typedef {Object} TransitionSystem
 * @property {Task} task - Complete with `task.done(result)`; returning a value
 * or a promise from the transition does not complete the task.
 * @property {string} state - State before the transition.
 * @property {ExtractList} extractList - Read state data.
 * @property {Dependencies} dependencies - Current built-in and injected dependencies.
 */

/**
 * A transition may complete its task synchronously or asynchronously.
 * @callback Transition
 * @param {TransitionSystem} system - Task and machine utilities.
 * @param {*} [data] - Update input, or the preceding chained transition's response.
 * @returns {*} The return value is ignored; complete `system.task` instead.
 */

/** @typedef {Record<string, Transition>} TransitionLibrary */

/**
 * 'positive' and 'negative' fire for the corresponding outcome of each step;
 * 'transition' fires for either outcome; 'update' fires once after the whole chain.
 * @typedef {'update'|'transition'|'positive'|'negative'} EventName
 */

/**
 * Event handlers run synchronously; their return values are ignored.
 * @callback EventCallback
 * @param {string} state - State after processing the transition result.
 * @param {*} [response] - Transition response, or the final response for 'update'.
 * @returns {void}
 */

/**
 * Snapshot accepted by `importState()` and returned by `exportState()`.
 * @typedef {Object} ExternalState
 * @property {string} state - Machine state.
 * @property {DtModel} [stateData] - Exported data model; always present on export.
 */

/**
 * Public API returned by `new Fsm(definition, lib)`.
 * @typedef {Object} FsmApi
 * @property {ReturnType<typeof import('./methods/setDependencies.js').default>} setDependencies - Merge dependencies.
 * @property {ReturnType<typeof import('./methods/getDependencies.js').default>} getDependencies - Read dependencies.
 * @property {ReturnType<typeof import('./methods/on.js').default>} on - Register an event handler.
 * @property {ReturnType<typeof import('./methods/off.js').default>} off - Remove all handlers for an event.
 * @property {ReturnType<typeof import('./methods/importState.js').default>} importState - Restore state and merge data.
 * @property {ReturnType<typeof import('./methods/exportState.js').default>} exportState - Export state and data.
 * @property {ReturnType<typeof import('./methods/update.js').default>} update - Execute or queue an action.
 * @property {ReturnType<typeof import('./methods/reset.js').default>} reset - Restore the initial state and data.
 * @property {ReturnType<typeof import('./methods/ignoreCacheUpdates.js').default>} ignoreCachedUpdates - Cancel queued updates.
 * @property {ReturnType<typeof import('./methods/getState.js').default>} getState - Read the current state.
 * @property {ReturnType<typeof import('./methods/extractList.js').default>} extractList - Read state-data values.
 */

/**
 * Constructible public entry point, including its static built-in dependencies.
 * @typedef {{new(definition: FsmDefinition, lib?: TransitionLibrary): FsmApi, dependencies: Dependencies}} FsmConstructor
 */

/**
 * Lookup tables keyed by `${state}/${action}`.
 * @typedef {Object} TransitionTables
 * @property {Record<string, Transition|null>} transitions - Functions or null for missing functions.
 * @property {Record<string, string>} nextState - State to enter after success.
 * @property {Record<string, ChainActions>} chainActions - Valid chaining pairs.
 */

/**
 * @typedef {Object} CachedUpdate
 * @property {Task} updateTask - Task whose promise was returned to the caller.
 * @property {string} action - Queued action name.
 * @property {*} [dt] - Queued input data.
 */

/**
 * Internal machine storage captured by method factories, exposed only in debug mode.
 * @private
 * @typedef {Object} FsmContext
 * @property {string} state - Current state.
 * @property {string} initialState - State restored by reset.
 * @property {DtObject} stateData - Current data split into segments.
 * @property {DtObject} initialStateData - Initial data split into segments.
 * @property {StateDataFormat} stateDataFormat - Default extraction options.
 * @property {boolean} lock - Whether an update is being processed.
 * @property {Array<CachedUpdate>} cache - Pending updates in arrival order.
 * @property {Dependencies} dependencies - Current dependencies.
 * @property {Record<EventName, Array<EventCallback>>} callback - Event-handler lists.
 * @property {FsmApi} api - Bound public methods.
 * @property {Record<string, Transition|null>} transitions - Bound transition table.
 * @property {Record<string, string>} nextState - Destination-state table.
 * @property {Record<string, ChainActions>} chainActions - Chaining table.
 * @property {ReturnType<typeof import('./methods/_setTransitions.js').default>} _setTransitions - Build lookup tables.
 * @property {ReturnType<typeof import('./methods/_updateStateData.js').default>} _updateStateData - Patch stored data.
 * @property {ReturnType<typeof import('./methods/_updateStep.js').default>} _updateStep - Process one transition step.
 * @property {ReturnType<typeof import('./methods/_warn.js').default>} _warn - Log missing transitions.
 * @property {ReturnType<typeof import('./methods/_transit.js').default>} _transit - Invoke a transition.
 * @property {ReturnType<typeof import('./methods/_getChain.js').default>} _getChain - Read chaining actions.
 * @property {ReturnType<typeof import('./methods/_triggerCacheUpdate.js').default>} _triggerCacheUpdate - Start the next queued update.
 * @property {ReturnType<typeof import('./methods/_onUpdateTask.js').default>} _onUpdateTask - Notify handlers and release the lock.
 */

const 
    MISSING_STATE = 'N/A'                     // State name if not defined
  , walk = dtbox.getWalk ()                   // Docs: https://github.com/PeterNaydenov/walk
  ;


/**
 * Create a finite state machine with serialized updates and optional action chains.
 * Use `new Fsm(...)`; the constructor returns the public API rather than its
 * internal storage. Missing transition functions produce unsuccessful steps.
 *
 * @param {FsmDefinition} definition - Initial state, data, and behavior table.
 * @param {TransitionLibrary} [lib={}] - Functions referenced by the behavior table.
 * @returns {FsmApi} Bound methods for updating and inspecting the machine.
 * @example
 * const machine = new Fsm({
 *     init: 'idle',
 *     behavior: [['idle', 'start', 'running', 'start']],
 *     stateData: {count: 0}
 * }, {
 *     start({task}, data) {
 *         task.done({success: true, stateData: {count: 1}, response: data});
 *     }
 * });
 * await machine.update('start', 'started');
 * machine.getState(); // 'running'
 */
function Fsm ({init, behavior, stateData={}, debug, stateDataFormat={as:'std'} }, lib={} ) {
            const 
                  fsm = this
                , api = {}
                ;
                
            fsm.state            = init || MISSING_STATE
            fsm.initialState     = init || MISSING_STATE
            fsm.stateDataFormat  = stateDataFormat   // Used in 'extractList' methods (library and transitions).
            fsm.lock             = false             // Switch 'ON' during transition in progress. Write other updates in cache.
            fsm.cache            = []                // cached 'update' actions

            fsm.dependencies = { 
                                walk
                              , dtbox
                              , askForPromise
                              , query : { splitSegments, joinSegments, updateState } 
                            }

            fsm.callback = {
                             update     : []
                           , transition : []
                           , positive   : []
                           , negative   : []
                        }
                        
            for ( let k in methods ) {   // Separate public and private methods.
                      if ( k.startsWith('_') )   fsm[k] = methods[k](fsm)  // Methods with '_' are private.
                      else                       api[k] = methods[k](fsm)
                }
            fsm.api = api
            fsm.stateData        = dtbox.init ( stateData ).query ( splitSegments )
            fsm.initialStateData = dtbox.init ( stateData ).query ( splitSegments )

            const {transitions, nextState, chainActions } = fsm._setTransitions ( behavior, lib );
            if ( debug ) {  
                        fsm._warn ( transitions )
                        global.debugFSM = fsm
                }

            fsm.transitions   = transitions
            fsm.nextState     = nextState
            fsm.chainActions  = chainActions
            return api
} // Fsm func.  



/**
 * Built-in dependency references for inspection or reuse. Each machine creates
 * its own dependency container; assigning this property does not configure it.
 * @type {Dependencies}
 */
Fsm.dependencies = { 
                      walk
                    , dtbox
                    , askForPromise
                    , query : { splitSegments, joinSegments, updateState }
                  }



export default /** @type {FsmConstructor} */ (Fsm)


