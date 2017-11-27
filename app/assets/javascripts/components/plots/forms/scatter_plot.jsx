import PlotForm, {
  subscribePlotInputField, TextField, CheckBox, Selector, commonfields, VectorSelector, MatrixSelector
} from './plot_form';

const scatterPlotFields = [
  subscribePlotInputField(['layout', 'xaxis', 'showgrid'])(CheckBox('X grid: ')),
  subscribePlotInputField(['layout', 'xaxis', 'title'])(TextField('X Axis Label: ')),
  subscribePlotInputField(['layout', 'yaxis', 'showgrid'])(CheckBox('Y grid: ')),
  subscribePlotInputField(['layout', 'yaxis', 'title'])(TextField('Y Axis Label: ')),
  subscribePlotInputField(['selectedReferenceTable'])(MatrixSelector('Reference Table'))
];

const defaultScatterPlot = {
  name: '',
  plot_type: 'scatter',
  manifest_id: undefined,
  selectedReferenceTable: undefined,
  layout: {
    height: undefined,
    width: undefined,
    yaxis: {
      showgrid: false,
      title: undefined
    },
    xaxis: {
      showgrid: false,
      title: undefined
    }
  },
  data: []
};

const clearedManifestFields = ['data', 'selectedReferenceTable'];

const scatterDataFields = [
  subscribePlotInputField(['name'])(TextField('Name: ')),
  subscribePlotInputField(['mode'])(
    Selector('Mode',[
      { label: 'Markers', value: 'markers' },
      { label: 'Lines', value: 'lines' },
      { label: 'Lines and Markers', value: 'lines+markers' }
    ])
  ),
  subscribePlotInputField(['x'])(VectorSelector('X')),
  subscribePlotInputField(['y'])(VectorSelector('Y'))
];

let defaultDataFields = {
  mode: 'markers',
  name: undefined,
  x: undefined,
  y: undefined
};

export default PlotForm(
  'Scatter Plot',
  defaultScatterPlot,
  clearedManifestFields,
  [...commonfields, ...scatterPlotFields],
  scatterDataFields,
  defaultDataFields
);