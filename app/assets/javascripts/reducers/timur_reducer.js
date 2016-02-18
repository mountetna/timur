
timurReducer = function(timur, action) {
  if (!timur) timur = {}
  switch(action.type) {
    case 'TOGGLE_CONFIG':
      var change = { };
      change[action.key] = timur.hasOwnProperty(action.key) ? !timur[action.key] : true;
      return $.extend({}, timur, change)
    default:
      return timur;
  }
}
