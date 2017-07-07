import { combineReducers } from 'redux'

const selectedManifest = (state = null, action) => {
  switch (action.type) {
    case 'SELECT_MANIFEST':
      return action.id
    default:
      return state
  }
}

export default combineReducers({
  selectedManifest
})
