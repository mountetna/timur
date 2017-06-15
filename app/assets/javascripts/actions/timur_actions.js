import Vector from 'vector'
import { getTSV, getView, getConsignments } from '../api/timur'
import { showMessages } from './message_actions'
import { requestDocuments } from './magma_actions'
import { Exchange } from './exchange_actions'
import Tab from '../models/tab'
import Manifest from '../models/consignment'

var timurActions = {
  toggleConfig: function(name) {
    return {
      type: 'TOGGLE_CONFIG',
      key: name
    }
  },
  requestView: function(model_name, record_name, tab_name, success, error) {
    return function(dispatch) {
      getView(model_name, tab_name, 
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
            dispatch(timurActions.requestConsignments(required_manifests))

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
  findManifest: function( state, manifest_name ) {
    var manifest = state.timur.manifests[ manifest_name ]
    if (!manifest) return null

    return new Manifest(manifest)
  },
  requestManifests: ( manifests, success, error ) => 
  (dispatch) => {
    getConsignments(manifests, new Exchange(dispatch, `consignment list ${manifests.map(m=>m.name).join(", ")}`)).then((response) => {
      for (var name in response) {
        dispatch(timurActions.addConsignment(name, response[name]))
      }
      if (success != undefined) success(response)

    }).catch((e) => e.response.json().then((response) => {
          if (response.query)
            dispatch(showMessages([
`
### For our inquiry:

\`${JSON.stringify(response.query)}\`

## this bitter response:

    ${response.errors}
`
            ]))
          else if (response.errors && response.errors.length == 1)
            dispatch(showMessages([
`### Our inquest has failed, for this fault:

    ${response.errors[0]}
`
            ]))
          else if (response.errors && response.errors.length > 1)
            dispatch(showMessages([
`### Our inquest has failed, for these faults:

${response.errors.map((error) => `* ${error}`).join('\n')}
`
            ]))
          if (error != undefined) error(response)
      })
    )
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
  addConsignment: function(name, consignment) {
    return {
      type: 'ADD_CONSIGNMENT',
      manifest_name: name,
      consignment: consignment
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

module.exports = timurActions;
