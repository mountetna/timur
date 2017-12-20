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

  /*
   * If the selected id is equal to 0 then retrun a new plot. The access is hard
   * set to 'private' on the server for now.
   */
  if(state.plots.selected == 0){
    return {
      id: 0,
      name: null,
      user_id: null,
      manifest_id: null,
      project: null,
      access: 'private', 
      plot_type: null,
      data: [],
      is_editable: true,
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
