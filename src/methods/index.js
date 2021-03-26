const
    _setTransitions      = require ( './_setTransitions'     )
  , _updateStep          = require ( './_updateStep'         )
  , _warn                = require ( './_warn'               )
  , _transit             = require ( './_transit'            ) 
  , _getChain            = require ( './_getChain'           )
  , _triggerCacheUpdate  = require ( './_triggerCacheUpdate' )

  , setDependencies     = require ( './setDependencies'    )
  , on                  = require ( './on'                 )
  , off                 = require ( './off'                )
  , importState         = require ( './importState'        )
  , exportState         = require ( './exportState'        )
  , update              = require ( './update'             )
  , reset               = require ( './reset'              )
  , ignoreCachedUpdates = require ( './ignoreCacheUpdates' )
  , getState            = require ( './getState'           )
  ;



const fn = {
// *** "Private" methods
              _setTransitions     // Convert machine configuration and transition library in a internal fsm structures
            , _updateStep         // Process results of transitions
            , _warn               // Warn on issues if "debug:true" in machine configuration
            , _transit            // Executes a transition if it is defined
            , _getChain           // Returns chainAction for the key if available
            , _triggerCacheUpdate // Call next transition from the cache
// *** Public methods
            , setDependencies          // Add objects in dependencies
            , on                       // Register callback functions on: 'update', 'transition', 'negative', 'positive'
            , off                      // Remove callbacks
            , importState              // Get state and data from outside
            , exportState              // Extract state from fsm
            , update                   // Trigger an action on fsm
            , reset                    // Change state and stateData to initial values
            , ignoreCachedUpdates      // Disable update records in the cache
            , getState                 // Return a state value
        }



module.exports = fn


