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
            dispatch(
              timurActions.requestManifests(
                model_name, required_manifests
              )
            )

          dispatch(
            timurActions.addTab(model_name, 
              response.tab_name, 
              response.tabs[response.tab_name]
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
  requestManifests: function( model_name, manifests, success, error ) {
    var self = this;
    var request = {
      queries: manifests
    }

    return function(dispatch) {
      $.ajax({
        url: Routes.query_json_path(),
        method: 'POST',
        data: JSON.stringify(request),
        dataType: 'json',
        contentType: 'application/json',
        success: function(response) {
          for (var name in response) {
            dispatch(timurActions.addManifest(name, response[name]))
          }
          if (success != undefined) success()
        },
        error: function(xhr, status, err) {
          if (error != undefined) {
            var message = JSON.parse(xhr.responseText)
            error(message)
          }
        }
      })
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
  }
}

module.exports = timurActions;
