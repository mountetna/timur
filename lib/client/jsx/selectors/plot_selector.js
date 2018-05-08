import { createSelector } from 'reselect';

export const getSelectedPlotId = (state)=>{
  return state.plots.selected;
}

export const getAllPlots= (state)=>{
  return Object.values(state.plots.plotsMap);
}

export const getPlotsByManifestId = (state, manifestId)=>{
  return getAllPlots(state).filter((plot)=>{
    return plot.manifestId === manifestId
  });
}

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

  /*
   * If there is no specified plot and we are not requesting a new 
   * plot (id == 0) then return null, and clear the screen.
   */
  return null;
}
