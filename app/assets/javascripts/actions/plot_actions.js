import { destroyPlot } from '../api/plot_actions'

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
