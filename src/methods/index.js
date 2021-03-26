const
    _setTransitions      = require ( './_setTransitions'     )
  , _updateStep          = require ( './_updateStep'         )
  , _warn                = require ( './_warn'               )
  , _transit             = require ( './_transit'            ) 
  , _getChain            = require ( './_getChain'           )
  , _triggerCacheUpdate  = require ( './_triggerCacheUpdate' )

  , setDependencies = require ( './setDependencies' )
  , on              = require ( './on'              )
  , off             = require ( './off'             )
  , exportState     = require ( './exportState'     )
  , update          = require ( './update'          )
  , reset           = require ( './reset'           )
  , ignoreCachedUpdates = require ( './ignoreCacheUpdates' )
  , importState     = require ( './importState'     )
  , getState        = require ( './getState'        )
  ;

const fn = {
              _setTransitions
            , _updateStep
            , _warn
            , _transit
            , _getChain
            , _triggerCacheUpdate

            , setDependencies
            , on
            , off
            , exportState
            , update
            , reset
            , ignoreCachedUpdates
            , importState
            , getState
        }



module.exports = fn


