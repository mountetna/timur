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

const manifest = (state = "", action) => {
  switch (action.type) {
    default:
      return state
  }
}

export default combineReducers({
  title,
  isUpdatingTitle,
  manifest
})