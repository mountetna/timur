//TODO get ride "freshen"
window.freshen = function() {
  return $.extend.call(
    null,
    {}, ...arguments
  )
}

import { combineReducers } from 'redux'
import magma from './magma_reducer'
import messages from './message_reducer'
import plots from './plot_reducer'
import timur from './timur_reducer'
import manifestEditor from './manifest_editor_reducer'
import manifests from './manifests_reducer'

export default combineReducers({
  timur,
  magma,
  messages,
  plots,
  manifestEditor,
  manifests
})
