import { combineReducers } from 'redux'
import magma from './magma_reducer'
import messages from './message_reducer'
import plots from './plots_reducer'
import timur from './timur_reducer'
import manifestsUI from './manifest_ui_reducer'
import manifests from './manifests_reducer'
import consignments from './consignments_reducer'
import exchanges from './exchanges_reducer'

//TODO hack to render the manifest tab. future me needs to use react-router
const appMode = (state = '', action) => {
  switch (action.type) {
    case 'CHANGE_MODE':
      return action.mode
    default:
      return state
  }
}

export default combineReducers({
  timur,
  magma,
  messages,
  plots,
  manifestsUI,
  manifests,
  consignments,
  exchanges,
  appMode
})
