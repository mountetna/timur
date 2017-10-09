import { createSelector } from 'reselect'

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
    case 'scatter':
      return new ScatterPlot(plot);
    case 'heatmap':
      return new Heatmap(plot);
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
    this.config = plot.configuration ? plot.configuration.config : this.defaultConfig();
    this.layout = plot.configuration ? plot.configuration.layout : this.defaultLayout();
    this.data = plot.configuration ? plot.configuration.data : [];
  }

  addData(data) {
    this.data = [ ...this.data, { id: Math.random(), ...data } ];
  }

  removeData(id) {
    this.data = this.data.filter(datum => datum.id != id);
  }

  defaultConfig() {
    return {
      showLink: false,
      displayModeBar: true,
      modeBarButtonsToRemove: ['sendDataToCloud', 'toggleSpikelines']
    };
  }

  defaultLayout() {
    return {
      width: 1600,
      height: 900,
      title: this.name || '',
      xaxis: {
        title: '',
        showline: true,
        showgrid: false,
        gridcolor: '#bdbdbd'
      },
      yaxis: {
        title: '',
        showline: true,
        showgrid: false,
        gridcolor: '#bdbdbd'
      }
    };
  }

  serialize() {
    return {
      name: this.plot.name,
      plot_type: this.plotType,
      configuration: {
        data: this.data,
        config: this.config,
        layout: this.layout
      }
    }
  }

  // override this method to transform serialized plot data to plotly data
  plotlyDataTransform(consignment) {
    if (!consignment) {
      return [];
    }
    return this.data;
  }

  toPlotly(consignment) {
    return {
      layout: this.layout,
      config: this.config,
      data: this.plotlyDataTransform(consignment)
    };
  }
}

class ScatterPlot extends Plot {
  constructor(plot = {}) {
    super(plot)
    this.selectedReferenceTable = plot.configuration ? plot.configuration.selectedReferenceTable : '';
  }

  plotlyDataTransform(consignment) {
    if (!consignment) {
      return [];
    }

    return this.data.map(d => {
      // add ids from y or x labels
      let ids = [];
      if (consignment[d.manifestSeriesY]) {
        ids = consignment[d.manifestSeriesY].labels;
      } else if (consignment[d.manifestSeriesX]) {
        ids = consignment[d.manifestSeriesX].labels;
      }

      // replace insert x and y data from the consignment
      return {
        ...d,
        x: consignment[d.manifestSeriesX] ? consignment[d.manifestSeriesX].values : [],
        y: consignment[d.manifestSeriesY] ? consignment[d.manifestSeriesY].values : [],
        ids,
      };
    });
  }
}