import { combineReducers } from 'redux'

const plotsMap = (state = {}, action) => {
  switch (action.type) {
    case 'ADD_PLOT':
      return {
        ...state,
        [action.plot.id]: action.plot
      }
    case 'REMOVE_PLOT':
      let newState = { ...state }
      delete newState[action.id]
      return newState
    case 'UPDATE_PLOT':
      return {
        ...state,
        [action.plot.id]: action.plot
      }
    default:
      return state
  }
}

const selected = (state = null, action) => {
  switch (action.type) {
    case 'SELECT_PLOT':
      return action.id
    default:
      return state
  }
}

const isEditing = (state = false, action) => {
  switch (action.type) {
    case 'TOGGLE_PLOT_EDITING':
      return typeof action.isEditing == "undefined" ? !state : action.isEditing
    default:
      return state
  }
}

export default combineReducers({
  plotsMap,
  selected,
  isEditing
})

export function allPlots(state) { return Object.keys(state.plotsMap).map(key => state.plotsMap[key]) }

export function plotsByIds(state, ids) { return ids.map(id => state.plotsMap[id]) }