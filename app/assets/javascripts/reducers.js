freshen = function() {
  return $.extend.call(
    null,
    {}, ...arguments
  )
}

magmaReducer = require('./reducers/magma_reducer.js')
messageReducer = require('./reducers/message_reducer.js')
plotReducer = require('./reducers/plot_reducer.js')
timurReducer = require('./reducers/timur_reducer.js')
