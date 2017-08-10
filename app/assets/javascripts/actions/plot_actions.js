import { showMessages } from './message_actions'
import { createPlot, destroyPlot, updatePlot } from '../api/plots'
import { manifestById } from '../reducers/manifests_reducer'

// remove a plot from the store
const removePlot = (id, manifestId) => ({
  type: 'REMOVE_PLOT',
  id,
  manifestId
})

// Delete a plot from the database and the store
export const deletePlot = (manifestId, plotId, callback = () => {}) =>
  (dispatch) => {
    destroyPlot(manifestId, plotId)
      .then(() => {
        dispatch(removePlot(plotId, manifestId))
        callback(plotId)
      })
  }


const addPlot = (plot) => ({
  type: 'ADD_PLOT',
  plot
})

// Add a plot to the store
export const loadPlot = (plot) =>
  (dispatch, getState) => {
    // is_editable flag equals the manifest is_editable flag
    const { manifests } = getState()
    const { is_editable } = manifestById(manifests, plot.manifest_id)
    const plotWithEditFlag =  { ...plot, is_editable }

    dispatch(addPlot(plotWithEditFlag))
  }

const plotToPayload = (plot) => {
  const { layout: { title }, plotType } = plot
  return {
    name: title,
    plot_type: plotType,
    configuration: plot
  }
}

export const savePlot = (manifest_id, id, plot, callback = () => {}) =>
  (dispatch) => {
    const payload = plotToPayload(plot)
    updatePlot(manifest_id, id, payload)
      .then(plot => {
        dispatch(loadPlot(plot))
        callback(plot)
      })
  }

// Post to create new plot and save in the store
export const saveNewPlot = (manifestId, plot, callback = () => {}) =>
  (dispatch) => {
    const payload = plotToPayload(plot)
    createPlot(manifestId, payload)
      .then(plot => {
        dispatch(addPlot(plot))
        callback(plot)
      })
      .catch(e => {
        e.response.json()
          .then(json => dispatch(showMessages(json.errors)))
      })
  }


