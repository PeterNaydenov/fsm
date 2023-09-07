## Migration Guides


## Migration from v.4.x.x to v.5.x.x.

// TODO: Describe changes




## Migration from v.1 to v.2
Project was started with simplest posible implementation. I like the approach and want to extend it. Reasons:
- Some of my transition function contain asynchronous events; 
- Describe chain of actions inside the transition condition records;
- Chain of action on positive and negative transition end;

So... about changes:
### Transition complete
- **Version 1**: Transition function should return **transitionResult** object.
- **Version 2**: Transition function receives as first param **task**. Task is askForPromise object. Transition is complete on `task.done(transitionResult)`.
- **Changes**: Find return statement and convert it to task.done:

```js
    // ver. 1 ->
    ...
    return { success : true }
    // ver. 2 ->
    ...
    task.done ({ success : true })

```