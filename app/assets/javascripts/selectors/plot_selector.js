import { createSelector } from 'reselect';

const getPlots = state => state.plots.plotsMap;

export const getSelectedPlotId = state => state.plots.selected;

export const getAllPlots = state => Object.values(getPlots(state));

export const getPlotsByManifestId = (state, manifestId) =>
  getAllPlots(state).filter(plot => plot.manifestId === manifestId);

/*
export const getSelectedPlot = createSelector(
  [ getPlots, getSelectedPlotId ],
  (plots, id) => plots[id]
);
*/

export const getSelectedPlot = (state)=>{
  if(state.plots.selected > 0){
    return state.plots.plotsMap[state.plots.selected];
  }

  // If the selected id is equal to 0 then retrun a new plot.
  if(state.plots.selected == 0){
    return {
      id: 0,
      name: null,
      manifest_id: null,
      data: [],
      is_editable: true,
      plot_type: null,
      layout: {
        height: 0,
        width: 0
      },
      config: {
        displayModeBar: true,
        modeBarButtonsToRemove: [
          'sendDataToCloud',
          'lasso2d',
          'toggleSpikelines'
        ],
        showLink: false
      }
    }
  }
}
