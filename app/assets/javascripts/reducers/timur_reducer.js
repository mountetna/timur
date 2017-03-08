var view = function(old_view, action) {
  if (!old_view) old_view = {}
  switch(action.type) {
    case 'ADD_VIEWS':
      var new_view = {}
      for (let tab_name of Object.keys(action.views)) {
        new_view[tab_name] = old_view[tab_name] || action.views[tab_name]
      }
      return new_view
    default:
      return old_view
  }
}

var views = function(old_views, action) {
  if (!old_views) old_views = {}
  switch(action.type) {
    case 'ADD_VIEWS':
      return {
        ...old_views,
        [action.model_name]: view(old_views[action.model_name], action)
      }
    default:
      return old_views
  }
}

var timurReducer = function(timur, action) {
  if (!timur) timur = {}
  switch(action.type) {
    case 'ADD_VIEWS':
      return {
        ...timur,
        views: views(timur.views,action),
      }
    case 'ADD_MANIFEST':
      return {
      }
    case 'TOGGLE_CONFIG':
      return {
        ...timur,
        [action.key]: timur.hasOwnProperty(action.key) ? !timur[action.key] : true
      }
    default:
      return timur;
  }
}

module.exports = timurReducer
