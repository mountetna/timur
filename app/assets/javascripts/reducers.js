window.freshen = function(old_obj, new_obj) {
  return $.extend(
    {},
    old_obj,
    new_obj
  )
}

window.magmaReducer = require('./reducers/magma_reducer.js')
window.messageReducer = require('./reducers/message_reducer.js')
window.plotReducer = require('./reducers/plot_reducer.js')
window.timurReducer = require('./reducers/timur_reducer.js')
