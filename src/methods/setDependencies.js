function setDependencies ( fsm ) {
return function ( deps ) {
    fsm.dependencies = { ...fsm.dependencies, ...deps }
}} // setDependencies func.



export default setDependencies


