# FSM examples

Each example is independent JavaScript for the 5.x API. The assertions show the expected states, responses, and stored values.

## Contents

- [Asynchronous work with injected dependencies](#asynchronous-work-with-injected-dependencies)
- [Failure chain with response forwarding](#failure-chain-with-response-forwarding)
- [Cancel queued work and restore a snapshot](#cancel-queued-work-and-restore-a-snapshot)

## Asynchronous work with injected dependencies

Use a transition to wait for a service and complete both success and failure paths. Here the service is deterministic so the example can run without network access.

```js
import assert from 'node:assert/strict'
import Fsm from '@peter.naydenov/fsm'

const machine = new Fsm({
    init: 'idle',
    behavior: [['idle', 'load', 'ready', 'load']],
    stateData: {value: null}
}, {
    async load({task, dependencies}, input) {
        try {
            const value = await dependencies.fetchValue(input)
            task.done({success: true, stateData: {value}, response: value})
        } catch (error) {
            task.done({success: false, response: {error: error.message}})
        }
    }
})

machine.setDependencies({
    async fetchValue(input) {
        if (input.fail) throw new Error('unavailable')
        return input.value
    }
})

assert.deepEqual(await machine.update('load', {fail: true}), {error: 'unavailable'})
assert.equal(machine.getState(), 'idle')
assert.deepEqual(machine.extractList(['value']), [null])
assert.equal(await machine.update('load', {value: 42}), 42)
assert.equal(machine.getState(), 'ready')
assert.deepEqual(machine.extractList(['value']), [42])
```

## Failure chain with response forwarding

The primary failure leaves the machine in `idle`, so the fallback row starts from `idle`. The final response comes from the fallback step.

```js
import assert from 'node:assert/strict'
import Fsm from '@peter.naydenov/fsm'

const machine = new Fsm({
    init: 'idle',
    behavior: [
        ['idle', 'start', 'primary', 'primary', [false, 'fallback']],
        ['idle', 'fallback', 'backup', 'backup']
    ],
    stateData: {source: null}
}, {
    primary({task}) {
        task.done({success: false, response: {reason: 'primary unavailable'}})
    },
    backup({task}, previousResponse) {
        task.done({
            success: true,
            stateData: {source: 'backup'},
            response: {source: 'backup', reason: previousResponse.reason}
        })
    }
})

const events = []
machine.on('negative', state => events.push(['negative', state]))
machine.on('positive', state => events.push(['positive', state]))

assert.deepEqual(await machine.update('start'), {
    source: 'backup', reason: 'primary unavailable'
})
assert.equal(machine.getState(), 'backup')
assert.deepEqual(machine.extractList(['source']), ['backup'])
assert.deepEqual(events, [['negative', 'idle'], ['positive', 'backup']])
```

## Cancel queued work and restore a snapshot

Hold the active task open to queue the next action. Attach its rejection handler before canceling. Releasing the active task completes it normally.

```js
import assert from 'node:assert/strict'
import Fsm from '@peter.naydenov/fsm'

let completeStart
const machine = new Fsm({
    init: 'idle',
    behavior: [
        ['idle', 'start', 'running', 'start'],
        ['running', 'finish', 'finished', 'finish']
    ],
    stateData: {count: 0}
}, {
    start({task}) {
        completeStart = () => task.done({
            success: true, stateData: {count: 1}, response: 'started'
        })
    },
    finish({task}) {
        task.done({success: true, response: 'finished'})
    }
})

const active = machine.update('start')
const queued = machine.update('finish').catch(reason => reason)
machine.ignoreCachedUpdates()
completeStart()

assert.equal(await active, 'started')
assert.equal(await queued, "Action 'finish' was ignored")
assert.equal(machine.getState(), 'running')

const snapshot = machine.exportState()
machine.reset()
assert.equal(machine.getState(), 'idle')
assert.deepEqual(machine.extractList(['count']), [0])
machine.importState(snapshot)
assert.equal(machine.getState(), 'running')
assert.deepEqual(machine.extractList(['count']), [1])
```
