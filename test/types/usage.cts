import Fsm from '@peter.naydenov/fsm'
import FsmRequired = require('@peter.naydenov/fsm')

const machine = new Fsm({behavior: []})
const state: string = machine.getState()
const response: Promise<unknown> = machine.update('start')
Fsm.dependencies.askForPromise()

// `module.exports = Fsm`: the required value is the constructor, with types on its namespace.
const definition: FsmRequired.FsmDefinition = {init: 'idle', behavior: [['idle', 'start', 'running', 'start']]}
const transitions: FsmRequired.TransitionLibrary = {
    start({task}) {
        const result: FsmRequired.TransitionResult = {success: true}
        task.done(result)
    }
}
const required = new FsmRequired(definition, transitions)
const requiredState: string = required.getState()

// @ts-expect-error Actions must be strings in CommonJS consumers too.
machine.update(false)
// @ts-expect-error The CommonJS export has no 'default' property.
FsmRequired.default
