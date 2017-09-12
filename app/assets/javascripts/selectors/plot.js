import { createSelector } from 'reselect'

const getPlots = (state) => state.plots.plotsMap

const getSelectedPlotId = (state) => state.plots.selected

export const getAllPlots = (state) => Object.values(getPlots(state));

export const getSelectedPlot = createSelector(
  [ getPlots, getSelectedPlotId ],
  (plots, id) => plots[id]
);