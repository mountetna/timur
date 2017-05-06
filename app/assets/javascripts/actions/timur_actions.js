import Vector from 'vector'
import { getTSV } from '../api/timur_api'
import { showMessages } from './message_actions'

var timurActions = {
  toggleConfig: function(name) {
    return {
      type: 'TOGGLE_CONFIG',
      key: name
    }
  },
  requestView: function(model_name, record_name, tab_name, success, error) {
    var self = this;
    var request = {
      model_name: model_name,
      tab_name: tab_name
    }
    return function(dispatch) {
      $.ajax({
        url: Routes.view_json_path(),
        method: 'POST',
        data: JSON.stringify(request), 
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          var panes = response.tabs[response.tab_name].panes
          var paneMap = (transform) => Object.keys(panes).map(
            (pane_name) => panes[pane_name].display.map(transform).filter((n) => n != null)
          ).flatten()

          var required_attributes = paneMap((display_item) => display_item.name)
          var required_manifests = paneMap((display_item) => display_item.attribute.plot ? {
              name: display_item.attribute.plot.name,
              manifest: [
                [ 'record_name', `'${ record_name }'` ],
                ...display_item.attribute.plot.manifest
              ]
            } : null
          )

          dispatch(
            magmaActions.requestDocuments(
              model_name, [ record_name ], required_attributes
            )
          )

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
        },
        error: function(xhr, status, err) {
          if (error != undefined) {
            error(JSON.parse(xhr.responseText))
          }
        }
      })
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
  requestManifests: function( manifests, success, error ) {
    var self = this;
    var request = {
      queries: manifests
    }

    return function(dispatch) {
      $.ajax({
        url: Routes.query_json_path(),
        method: 'POST',
        data: JSON.stringify(request),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response) {
          for (var name in response) {
            dispatch(timurActions.addManifest(name, response[name]))
          }
          if (success != undefined) success(response)
        },
        error: function(xhr, status, err) {
          var response
          try {
            response = JSON.parse(xhr.responseText)
          } catch(e) {
            response = err
          }
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
        }
      })
    }
  },
  requestTSV: function(model_name,record_names) {
    return function(dispatch) {
      getTSV(model_name,record_names)
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
