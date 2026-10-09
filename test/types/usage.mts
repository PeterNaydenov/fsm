import Fsm, {type FsmDefinition, type TransitionLibrary} from '@peter.naydenov/fsm'

const definition: FsmDefinition = {
    init: 'idle',
    behavior: [['idle', 'start', 'running', 'start', [false, 'retry']]],
    stateData: {count: 0}
}
const transitions: TransitionLibrary = {
    start({task, state, extractList, dependencies}, data) {
        const currentState: string = state
        const [count] = extractList(['count'])
        const allData: Record<string, unknown> = extractList()
        const model = dependencies.dtbox.load([['root', {count}, 'root', []]])
        task.done({success: true, stateData: model, response: {currentState, allData, data}})
    }
}

const machine = new Fsm(definition, transitions)
const state: string = machine.getState()
const response: Promise<unknown> = machine.update('start', {source: 'button'})
const [count] = machine.extractList(['count'], {as: 'std'})
const allData: Record<string, unknown> = machine.extractList()
machine.on('update', (state, response) => {
    const currentState: string = state
})
machine.off('update')
machine.setDependencies({service: {ready: true}})
machine.getDependencies().askForPromise()
Fsm.dependencies.askForPromise()
machine.importState(machine.exportState())
machine.reset()
machine.ignoreCachedUpdates()

// @ts-expect-error Configuration requires a behavior table.
new Fsm({init: 'idle'})
// @ts-expect-error Chain actions must be action names or false.
new Fsm({behavior: [['idle', 'start', 'running', 'start', [true, false]]]})
// @ts-expect-error Actions must be strings.
machine.update(123)
// @ts-expect-error Only supported event names may be registered.
machine.on('unknown', () => {})
// @ts-expect-error State is a string.
const invalidState: number = machine.getState()
// @ts-expect-error Extracting a list returns an array, not a scalar.
const invalidList: number = machine.extractList(['count'])
// @ts-expect-error State-data formats require an 'as' property.
machine.extractList(['count'], {})
