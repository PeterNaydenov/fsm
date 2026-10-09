import askForPromise from 'ask-for-promise';
export type ChainActions = [string | false, string | false];
export type BehaviorRow = [string, string, string, string, ChainActions?];
export type StateDataFormat = {
    /**
     * - dt-toolbox format, such as 'std', 'tuples', 'dt-model',
     * or 'dt-object'.
     */
    as: string;
};
export type DtLine = [string, Record<string, any> | Array<any>, string, Array<[string, string]>];
export type DtModel = Array<DtLine>;
export type DtObject = {
    /**
     * - Apply a query to the model.
     */
    query: (fn: Function, ...args: any[]) => DtObject;
    /**
     * - Export the whole model or a segment.
     */
    export: (segment?: string) => DtModel;
    /**
     * - Convert selected data to a format.
     */
    model: (fn: Function, ...args: any[]) => any;
    /**
     * - Extract values.
     */
    extractList: (segments: Array<string>, options?: StateDataFormat) => Array<any>;
};
export type StateDataUpdate = Record<string, any> | DtModel | DtObject;
export type FsmDefinition = {
    /**
     * - Initial state; falsy values fall back to 'N/A'.
     */
    init?: string;
    /**
     * - State/action rules; an empty table is valid.
     */
    behavior: Array<BehaviorRow>;
    /**
     * - Initial state-data fields and segments.
     */
    stateData?: Record<string, any>;
    /**
     * - Log missing transitions and expose the internal
     * machine as `global.debugFSM` in environments that provide `global`.
     */
    debug?: boolean;
    /**
     * - Default extraction format.
     */
    stateDataFormat?: StateDataFormat;
};
export type ExtractList = ((requestedSegments: Array<string>, options?: StateDataFormat | false) => Array<any>) & (() => Record<string, any>);
export type DtToolbox = {
    /**
     * - Initialize data.
     */
    init: (data: any, options?: {
        model?: string;
    }) => (DtObject | null);
    /**
     * - Load an exported model.
     */
    load: (data: DtModel) => DtObject;
    /**
     * - Convert data to a model.
     */
    flat: Function;
    /**
     * - Convert data between supported formats.
     */
    convert: Function;
    /**
     * - Get the tree walker.
     */
    getWalk: () => Function;
};
export type BuiltinDependencies = {
    /**
     * - dt-toolbox's tree walker.
     */
    walk: Function;
    /**
     * - Data-model utilities.
     */
    dtbox: DtToolbox;
    /**
     * - Promise-task factory.
     */
    askForPromise: typeof askForPromise;
    /**
     * - State-data queries.
     */
    query: {
        splitSegments: Function;
        joinSegments: Function;
        updateState: Function;
    };
};
export type Dependencies = BuiltinDependencies & Record<string, any>;
export type Task = import('ask-for-promise').AskObject;
export type TransitionResult = {
    /**
     * - Whether to enter the configured next state.
     */
    success: boolean;
    /**
     * - Patch applied only on success.
     */
    stateData?: StateDataUpdate;
    /**
     * - Value passed to callbacks, the next chained action,
     * and, for the final step, the promise returned by `update()`.
     */
    response?: any;
};
export type TransitionSystem = {
    /**
     * - Complete with `task.done(result)`; returning a value
     * or a promise from the transition does not complete the task.
     */
    task: Task;
    /**
     * - State before the transition.
     */
    state: string;
    /**
     * - Read state data.
     */
    extractList: ExtractList;
    /**
     * - Current built-in and injected dependencies.
     */
    dependencies: Dependencies;
};
export type Transition = (system: TransitionSystem, data?: any) => any;
export type TransitionLibrary = Record<string, Transition>;
export type EventName = 'update' | 'transition' | 'positive' | 'negative';
export type EventCallback = (state: string, response?: any) => void;
export type ExternalState = {
    /**
     * - Machine state.
     */
    state: string;
    /**
     * - Exported data model; always present on export.
     */
    stateData?: DtModel;
};
export type FsmApi = {
    /**
     * - Merge dependencies.
     */
    setDependencies: ReturnType<typeof import('./methods/setDependencies.js').default>;
    /**
     * - Read dependencies.
     */
    getDependencies: ReturnType<typeof import('./methods/getDependencies.js').default>;
    /**
     * - Register an event handler.
     */
    on: ReturnType<typeof import('./methods/on.js').default>;
    /**
     * - Remove all handlers for an event.
     */
    off: ReturnType<typeof import('./methods/off.js').default>;
    /**
     * - Restore state and merge data.
     */
    importState: ReturnType<typeof import('./methods/importState.js').default>;
    /**
     * - Export state and data.
     */
    exportState: ReturnType<typeof import('./methods/exportState.js').default>;
    /**
     * - Execute or queue an action.
     */
    update: ReturnType<typeof import('./methods/update.js').default>;
    /**
     * - Restore the initial state and data.
     */
    reset: ReturnType<typeof import('./methods/reset.js').default>;
    /**
     * - Cancel queued updates.
     */
    ignoreCachedUpdates: ReturnType<typeof import('./methods/ignoreCacheUpdates.js').default>;
    /**
     * - Read the current state.
     */
    getState: ReturnType<typeof import('./methods/getState.js').default>;
    /**
     * - Read state-data values.
     */
    extractList: ReturnType<typeof import('./methods/extractList.js').default>;
};
export type FsmConstructor = {
    new (definition: FsmDefinition, lib?: TransitionLibrary): FsmApi;
    dependencies: Dependencies;
};
export type TransitionTables = {
    /**
     * - Functions or null for missing functions.
     */
    transitions: Record<string, Transition | null>;
    /**
     * - State to enter after success.
     */
    nextState: Record<string, string>;
    /**
     * - Valid chaining pairs.
     */
    chainActions: Record<string, ChainActions>;
};
export type CachedUpdate = {
    /**
     * - Task whose promise was returned to the caller.
     */
    updateTask: Task;
    /**
     * - Queued action name.
     */
    action: string;
    /**
     * - Queued input data.
     */
    dt?: any;
};
export type FsmContext = {
    /**
     * - Current state.
     */
    state: string;
    /**
     * - State restored by reset.
     */
    initialState: string;
    /**
     * - Current data split into segments.
     */
    stateData: DtObject;
    /**
     * - Initial data split into segments.
     */
    initialStateData: DtObject;
    /**
     * - Default extraction options.
     */
    stateDataFormat: StateDataFormat;
    /**
     * - Whether an update is being processed.
     */
    lock: boolean;
    /**
     * - Pending updates in arrival order.
     */
    cache: Array<CachedUpdate>;
    /**
     * - Current dependencies.
     */
    dependencies: Dependencies;
    /**
     * - Event-handler lists.
     */
    callback: Record<EventName, Array<EventCallback>>;
    /**
     * - Bound public methods.
     */
    api: FsmApi;
    /**
     * - Bound transition table.
     */
    transitions: Record<string, Transition | null>;
    /**
     * - Destination-state table.
     */
    nextState: Record<string, string>;
    /**
     * - Chaining table.
     */
    chainActions: Record<string, ChainActions>;
    /**
     * - Build lookup tables.
     */
    _setTransitions: ReturnType<typeof import('./methods/_setTransitions.js').default>;
    /**
     * - Patch stored data.
     */
    _updateStateData: ReturnType<typeof import('./methods/_updateStateData.js').default>;
    /**
     * - Process one transition step.
     */
    _updateStep: ReturnType<typeof import('./methods/_updateStep.js').default>;
    /**
     * - Log missing transitions.
     */
    _warn: ReturnType<typeof import('./methods/_warn.js').default>;
    /**
     * - Invoke a transition.
     */
    _transit: ReturnType<typeof import('./methods/_transit.js').default>;
    /**
     * - Read chaining actions.
     */
    _getChain: ReturnType<typeof import('./methods/_getChain.js').default>;
    /**
     * - Start the next queued update.
     */
    _triggerCacheUpdate: ReturnType<typeof import('./methods/_triggerCacheUpdate.js').default>;
    /**
     * - Notify handlers and release the lock.
     */
    _onUpdateTask: ReturnType<typeof import('./methods/_onUpdateTask.js').default>;
};
declare const _default: FsmConstructor;
export default _default;
