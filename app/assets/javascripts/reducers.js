window.freshen = function() {
  return $.extend.call(
    null,
    {}, ...arguments
  )
}

window.magmaReducer = require('./reducers/magma_reducer.js')
window.messageReducer = require('./reducers/message_reducer.js')
window.plotReducer = require('./reducers/plot_reducer.js')
window.timurReducer = require('./reducers/timur_reducer.js')
