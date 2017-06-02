import Vector from 'vector'
import { getTSV, getView, getConsignments } from '../api/timur'
import { showMessages } from './message_actions'
import { requestDocuments } from './magma_actions'
import Tab from '../readers/tab'
import { Exchange } from './exchange_actions'

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
            dispatch(timurActions.requestManifests(required_manifests))

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

    var ISO_FORMAT = /[+-]?\d{4}(-[01]\d(-[0-3]\d(T[0-2]\d:[0-5]\d:?([0-5]\d(.\d+)?)?([+-][0-2]\d:[0-5]\d)?Z?)?)?)?/

    return JSON.parse(
      JSON.stringify(manifest), 
      (key, value) => {
        if (typeof value === 'string' && value.match(ISO_FORMAT)) {
          return new Date(value)
        } else if (Array.isArray(value) && value.every((item) => item != null && typeof item === 'object' && 'label' in item && 'value' in item)) {
          return new Vector(value)
        } else if (value != null && typeof value === 'object' && 'matrix' in value && 'rows' in value.matrix) {
          return new Matrix(value.matrix)
        }
        return value
      }
    )
  },
  requestManifests: ( manifests, success, error ) => 
  (dispatch) => {
    getConsignments(manifests, new Exchange(dispatch, `consignment list ${manifests.map(m=>m.name).join(", ")}`)).then((response) => {
      for (var name in response) {
        dispatch(timurActions.addManifest(name, response[name]))
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
  addManifest: function(name, manifest) {
    return {
      type: 'ADD_MANIFEST',
      manifest_name: name,
      manifest: manifest
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
