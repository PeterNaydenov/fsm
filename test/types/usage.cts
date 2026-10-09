import Fsm from '@peter.naydenov/fsm'

const machine = new Fsm({behavior: []})
const state: string = machine.getState()
const response: Promise<unknown> = machine.update('start')
Fsm.dependencies.askForPromise()

// @ts-expect-error Actions must be strings in CommonJS consumers too.
machine.update(false)
