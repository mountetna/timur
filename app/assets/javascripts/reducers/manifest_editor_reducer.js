import { combineReducers } from 'redux'

const title = (state = '', action) => {
  switch (action.type) {
    case 'UPDATE_MANIFEST_TITLE':
      return action.title
    default:
      return state
  }
}

const isUpdatingTitle = (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE_IS_TITLE_UPDATING':
      return !state
    default:
      return state
  }
}

const isEditingManifestElement = (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE_IS_EDITING_MANIFEST_ELEMENT':
      return !state
    default:
      return state
  }
}

const selectedManifestElement = (state = '', action) => {
  switch (action.type) {
    case 'SELECT_MANIFEST_ELEMENT':
    case 'TOGGLE_IS_EDITING_MANIFEST_ELEMENT':
      return action.key
    default:
      return state
  }
}

const manifest = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_MANIFEST_ELEMENT':
      return {...state, [action.key]: action.value}
    case 'DELETE_MANIFEST_ELEMENT':
      let newState = {...state}
      delete newState[action.key]
      return newState
    default:
      return state
  }
}

export default combineReducers({
  title,
  isUpdatingTitle,
  isEditingManifestElement,
  selectedManifestElement,
  manifest
})