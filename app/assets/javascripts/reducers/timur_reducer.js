var view = function(old_view, action) {
  if (!old_view) old_view = {}
  switch(action.type) {
    case 'ADD_TAB':
      return {
        ...old_view,
        [action.tab_name]: action.tab
      }
    default:
      return old_view
  }
}

var views = function(old_views, action) {
  if (!old_views) old_views = {}
  switch(action.type) {
    case 'ADD_TAB':
      return {
        ...old_views,
        [action.model_name]: view(old_views[action.model_name], action)
      }
    default:
      return old_views
  }
}

var timurReducer = function(timur, action) {
  if (!timur) timur = {
    manifests: {}
  }
  switch(action.type) {
    case 'ADD_TAB':
      return {
        ...timur,
        views: views(timur.views,action),
      }
    case 'ADD_MANIFEST':
      return {
        ...timur,
        manifests: {
          ...timur.manifests,
          [action.manifest_name]:  action.manifest
        }
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
