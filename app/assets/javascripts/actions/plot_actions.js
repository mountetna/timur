import { showMessages } from './message_actions'
import { createPlot, destroyPlot, updatePlot } from '../api/plots'

// remove a plot from the store
const removePlot = (id, manifestId) => ({
  type: 'REMOVE_PLOT',
  id
});

// Delete a plot from the database and the store
export const deletePlot = (plot, callback = () => {}) =>
  (dispatch) => {
    destroyPlot(plot)
      .then(() => {
        dispatch(removePlot(plot.id));
        callback(plot);
      })
  }

export const selectPlot = (id) => ({
  type: 'SELECT_PLOT',
  id
})

export const toggleEditing = (isEditing) => ({
  type: 'TOGGLE_PLOT_EDITING',
  isEditing
})

export const addPlot = (plot) => ({
  type: 'ADD_PLOT',
  plot
})

export const savePlot = (plot, callback = () => {}) =>
  (dispatch) => {
    updatePlot(plot)
      .then(plot => {
        dispatch(addPlot(plot));
        callback(plot);
      })
  }

// Post to create new plot and save in the store
export const saveNewPlot = (plot, callback = () => {}) =>
  (dispatch) => {
    createPlot(plot)
      .then(plot => {
        dispatch(addPlot(plot));
        callback(plot);
      })
      .catch(e => {
        e.response.json()
          .then(json => dispatch(showMessages(json.errors)))
      })
  }

