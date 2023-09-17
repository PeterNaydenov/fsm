function setDependencies ( fsm ) {
return function setDependencies ( deps ) {
    fsm.dependencies = { ...fsm.dependencies, ...deps }
}} // setDependencies func.



export default setDependencies


