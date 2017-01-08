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
            return typeof(display_item)=="string" ? display_item : null 
          })
          var required_tables = paneMap(function(display_item) { 
            return display_item.data && display_item.data.query ? display_item.data.query : null
          })

          dispatch(
            magmaActions.requestDocuments(
              model_name, [ record_name ], required_attributes
            )
          )

          dispatch(
            magmaActions.queryData(
              model_name, { record_name: record_name }, required_tables
            )
          )

          console.log("Required tables for this tab:")
          console.log(required_tables)

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
  addViews: function(model_name, views) {
    return {
      type: 'ADD_VIEWS',
      model_name: model_name,
      views: views
    }
  }
}

module.exports = timurActions;
