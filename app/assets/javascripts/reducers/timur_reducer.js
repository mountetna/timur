var view = function(old_view, action) {
  if (!old_view) old_view = {}
  switch(action.type) {
    case 'ADD_VIEWS':
      new_view = {}
      Object.keys(action.views).forEach(function(tab_name) {
        new_view[tab_name] = old_view[tab_name] || action.views[tab_name]
      })
      return new_view
    default:
      return old_view
  }
}

var views = function(old_views, action) {
  if (!old_views) old_views = {}
  switch(action.type) {
    case 'ADD_VIEWS':
      new_views = {}
      new_views[action.model_name] = view(old_views[action.model_name], action)
      return freshen( old_views, new_views )
    default:
      return old_views
  }
}

var timurReducer = function(timur, action) {
  if (!timur) timur = {}
  switch(action.type) {
    case 'ADD_VIEWS':
      return freshen( timur, {
          views: views(timur.views,action),
        })
    case 'TOGGLE_CONFIG':
      var change = { };
      change[action.key] = timur.hasOwnProperty(action.key) ? !timur[action.key] : true;
      return $.extend({}, timur, change)
    default:
      return timur;
  }
}

module.exports = timurReducer
