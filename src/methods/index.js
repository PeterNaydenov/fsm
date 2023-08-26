import _setTransitions from './_setTransitions.js'
import _updateStep     from './_updateStep.js'         
import _warn           from './_warn.js'               
import _transit        from './_transit.js'            
import _getChain       from './_getChain.js'           
import _triggerCacheUpdate from './_triggerCacheUpdate.js' 
import _onUpdateTask   from './_onUpdateTask.js'       
import setDependencies from './setDependencies.js'
import getDependencies from './getDependencies.js'    
import on              from './on.js'                 
import off             from './off.js'                
import importState     from './importState.js'
import exportState     from './exportState.js'
import update          from './update.js'     
import reset           from './reset.js'           
import ignoreCachedUpdates from './ignoreCacheUpdates.js'
import getState        from './getState.js'



const fn = {
// *** "Private" methods
              _setTransitions     // Convert machine configuration and transition library in a internal fsm structures
            , _updateStep         // Process results of transitions
            , _warn               // Warn on issues if "debug:true" in machine configuration
            , _transit            // Executes a transition if it is defined
            , _getChain           // Returns chainAction for the key if available
            , _triggerCacheUpdate // Call next transition from the cache
            , _onUpdateTask       // Executes on update success. Used in "update" and "_triggerCacheUpdate"
// *** Public methods
            , setDependencies          // Add objects to dependencies object
            , getDependencies          // Returns the dependencies object
            , on                       // Register callback functions on: 'update', 'transition', 'negative', 'positive'
            , off                      // Remove callbacks
            , importState              // Get state and data from outside
            , exportState              // Extract state from fsm
            , update                   // Trigger an action on fsm
            , reset                    // Change state and stateData to initial values
            , ignoreCachedUpdates      // Disable update records in the cache
            , getState                 // Return a state value
        }



export default fn


