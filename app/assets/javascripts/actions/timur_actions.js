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
          var paneMap = function(transform) {
            return Object.keys(response.tabs[response.tab_name].panes).map(
              function(pane_name) {
                return response
                  .tabs[response.tab_name]
                  .panes[pane_name]
                  .display.map(transform).filter(function(n) { return n != null })
              }
            ).flatten()
          }

          var required_attributes = paneMap(function(display_item) {
            return display_item.name
          })
          var required_manifests = paneMap(function(display_item) { 
            return display_item.overrides.plot ? {
              name: display_item.overrides.plot.name,
              manifest: {
                record_name: {
                  type: "formula",
                  value: record_name
                },
                ...display_item.overrides.plot.manifest
              }
            } : null
          })

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
            timurActions.addViews(model_name, response.tabs)
          )

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
          magmaActions.consumePayload(dispatch,response)
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
  addViews: function(model_name, views) {
    return {
      type: 'ADD_VIEWS',
      model_name: model_name,
      views: views
    }
  }
}

module.exports = timurActions;
