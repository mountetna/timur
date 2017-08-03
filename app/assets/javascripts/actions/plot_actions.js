import { showMessages } from './message_actions'
import { createPlot, destroyPlot } from '../api/plots'

// Add a plot to the store
export const addPlot = (plot) => ({
  type: 'ADD_PLOT',
  plot
})

// remove a plot from the store
const removePlot = (id) => ({
  type: 'REMOVE_PLOT',
  id
})

// Delete a plot from the database and the store
export const deletePlot = (manifestId, plotId) =>
  (dispatch) => {
    destroyPlot(manifestId, plotId)
      .then(() => {
        dispatch(removePlot(plotId))
      })
  }

export const savePlot = (plot) =>
  (dispatch) => {
    updatePlot(plot.manifest_id, plot.id)
      .then(({manifest}) => {})
  }

const plotToPayload = (plot) => {
  const { layout: { title }, plotType } = plot
  return {
    name: title,
    plot_type: plotType,
    configuration: plot
  }
}

// Post to create new plot and save in the store
export const saveNewPlot = (manifestId = 1, plot) =>
  (dispatch) => {
    const payload = plotToPayload(plot)
    createPlot(manifestId, payload)
      .then(plot => {
        dispatch(addPlot(plot))
      })
      .catch(e => {
        e.response.json()
          .then(json => dispatch(showMessages(json.errors)))
      })
  }


