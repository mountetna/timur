import { showMessages } from './message_actions'
import { createPlot, destroyPlot, updatePlot } from '../api/plots'
import { manifestById } from '../selectors/manifest'

// remove a plot from the store
const removePlot = (id, manifestId) => ({
  type: 'REMOVE_PLOT',
  id,
  manifestId
});

// Delete a plot from the database and the store
export const deletePlot = (manifestId, plotId, callback = () => {}) =>
  (dispatch) => {
    destroyPlot(manifestId, plotId)
      .then(() => {
        dispatch(removePlot(plotId, manifestId));
        callback(plotId);
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

const addPlot = (plot) => ({
  type: 'ADD_PLOT',
  plot
})

// Add a plot to the store
export const loadPlot = (plot) =>
  (dispatch, getState) => {
    // is_editable flag equals the manifest is_editable flag
    const { is_editable } = manifestById(getState(), plot.manifest_id);
    const plotWithEditFlag =  { ...plot, is_editable };

    dispatch(addPlot(plotWithEditFlag));
  }

export const savePlot = (manifestId, plotId, plot, callback = () => {}) =>
  (dispatch) => {
    updatePlot(manifestId, plotId, plot)
      .then(plot => {
        dispatch(loadPlot(plot));
        callback(plot);
      })
  }

// Post to create new plot and save in the store
export const saveNewPlot = (manifestId, plot, callback = () => {}) =>
  (dispatch) => {
    createPlot(manifestId, plot)
      .then(plot => {
        dispatch(addPlot({ ...plot, is_editable: true }));
        callback(plot);
      })
      .catch(e => {
        e.response.json()
          .then(json => dispatch(showMessages(json.errors)))
      })
  }


