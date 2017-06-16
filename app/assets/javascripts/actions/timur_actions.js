import Vector from 'vector'
import { getTSV, getView } from '../api/timur'
import { showMessages } from './message_actions'
import { requestDocuments } from './magma_actions'
import { Exchange } from './exchange_actions'
import { requestConsignments } from './consignment_actions'
import Tab from '../models/tab'

var timurActions = {
  toggleConfig: function(name) {
    return {
      type: 'TOGGLE_CONFIG',
      key: name
    }
  },
  requestView: function(model_name, record_name, tab_name, success, error) {
    return function(dispatch) {
      getView(
        model_name, tab_name, 
        new Exchange(dispatch, `view for ${model_name} ${record_name}`)
      )
        .then((response)=> {
          var tab = new Tab(
            model_name, 
            record_name,
            response.tab_name,
            response.tabs[response.tab_name],
            null
          )

          dispatch(
            requestDocuments({
              model_name, 
              record_names: [ record_name ], 
              attribute_names: tab.requiredAttributes(),
              exchange_name: `tab ${response.tab_name} for ${model_name} ${record_name}`
            })
          )

          var required_manifests = tab.requiredManifests()

          if (required_manifests.length > 0)
            dispatch(requestConsignments(required_manifests))

          for (var tab_name in response.tabs)
            dispatch(
              timurActions.addTab(
                model_name, 
                tab_name, 
                response.tabs[tab_name]
              )
            )

          if (success != undefined) success()
        })
        .catch((err) => { if (error != undefined) error(err) })
    }
  },
  requestTSV: function(model_name,record_names) {
    return function(dispatch) {
      getTSV(model_name,record_names, new Exchange(dispatch, `request-tsv-${model_name}`))
        .catch(
          (error) => dispatch(
            showMessages([
`### Our attempt to create a TSV failed.

${error}`
            ])
          )
        )
    }
  },
  addTab: function(model_name, tab_name, tab) {
    return {
      type: 'ADD_TAB',
      model_name: model_name,
      tab_name: tab_name,
      tab: tab
    }
  },
  changeMode(mode) {
    return {
      type: 'CHANGE_MODE',
      mode
    }
  }
}

module.exports = timurActions
