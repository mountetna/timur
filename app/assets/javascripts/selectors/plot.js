import { createSelector } from 'reselect'

const getPlots = state => state.plots.plotsMap

const getSelectedPlotId = state => state.plots.selected

export const getPlotsByIds = (state, ids) => ids.map(id => getPlots(state)[id])

export const getAllPlots = state => Object.values(getPlots(state));

export const getSelectedPlot = createSelector(
  [ getPlots, getSelectedPlotId ],
  (plots, id) => plots[id]
);