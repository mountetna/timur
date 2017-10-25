import { createSelector } from 'reselect';

const getPlots = state => state.plots.plotsMap;

const getSelectedPlotId = state => state.plots.selected;

export const getPlotsByIds = (state, ids = []) => ids.map(id => getPlots(state)[id]).map(PlotFactory);

export const getAllPlots = state => Object.values(getPlots(state)).map(PlotFactory);

export const getSelectedPlot = createSelector(
  [ getPlots, getSelectedPlotId ],
  (plots, id) => PlotFactory(plots[id])
);

export function PlotFactory(plot = {}) {
  switch(plot.plot_type) {
    case 'heatmap':
      //return new Heatmap(plot)
    case 'scatter':
      return new Plot(plot)
    default:
      return null;
  }
}

export class Plot {
  constructor(plot = {}) {
    this.plotType = plot.plot_type;
    this.id = plot.id;
    this.editable = plot.is_editable || true;
    this.manifestId = plot.manifest_id;
    this.name = plot.name;

    if (plot.configuration) {
      Object.entries(plot.configuration).map(([ key, value ]) => {
        this[key] = value;
      });
    }

    if (!this.layout) {
      this.layout = {
        xaxis: {},
        yaxis: {}
      };
    }
  }

  addData(plot, data) {
    plot.data = [
      ...plot.data || [],
      {
        id: Math.random(),
        ...data
      }
    ]

    return plot.data
  }

  removeData(plot, id) {
    plot.data = plot.data.filter(series => series.id != id)

    return plot.data
  }

  serialize(plot) {
    return {
      id: plot.id,
      manifest_id: plot.manifestId,
      name: plot.name,
      plot_type: plot.plotType,
      configuration: {
        data: plot.data,
        layout: plot.layout,
        selectedReferenceTable: plot.selectedReferenceTable
      }
    };
  }
}