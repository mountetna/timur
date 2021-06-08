import { createSelector } from 'reselect';
import { plotScript } from 'etna-js/plots/plot_script';

export const newPlot = () => {
  let date = new Date();
  let plot = {
    id: 0,
    access: 'private',
    name: null,
    script: '',
    configuration: {
      layout: {
        height: 200,
        margin: { top: 30, bottom: 30, left: 30, right: 30 }
      },
      variables: { },
      plot_series: [],
      plot_type: null
    },
    created_at: date.toString(),
    updated_at: date.toString()
  };
  return plot;
};

// this strange return value is because reselect doesn't let us have optional args
const selectPlotById = (state, plot_id, inputs={}) =>
  plot_id ? [state.plots.plotsMap[plot_id], inputs] : [];

const plotWithScript = ([plot, inputs]) => (
  plot ? {
  ...plot,
  plotScript: plotScript(plot, inputs)
} : null);

export const selectPlot = createSelector(
  selectPlotById,
  plotWithScript
);

export const getAllPlots = state => {
  return Object.values(state.plots.plotsMap);
};

export const getPlotsByManifestId = (state, manifestId) => {
  return getAllPlots(state).filter(plot => {
    return plot.manifestId === manifestId;
  });
};
