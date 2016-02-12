//= require react_ujs

React    = require('react');
ReactDOM = require('react-dom');
Redux = require('redux');
Promise = require('es6-promise').Promise;

Provider = require('react-redux').Provider;

connect = require('react-redux').connect;
fetch = require('isomorphic-fetch');
thunk = require('redux-thunk');
chroma = require('chroma-js');

Errors = require('./components/errors.js.jsx');
Browser = require('./components/browser.js.jsx');
Header = require('./components/header.js.jsx');
Selector = require('./components/selector.js.jsx');
BaseAttribute = require('./components/base_attribute.js');
AttributeHelpers = require('./components/attribute_helpers.js');
Attributes = require('./components/attributes.js.jsx');
Attribute = require('./components/attribute.jsx');
AttributeRow = require('./components/attribute_row.jsx');
LinkAttributeEditor = require('./components/link_attribute_editor.jsx');
NewLink = require('./components/new_link.jsx');
LinkUnlinker = require('./components/link_unlinker.jsx');
Collection = require('./components/collection.js.jsx');
CollectionUnlink = require('./components/collection_unlink.jsx');
TableViewer = require('./components/table_viewer.jsx');
TableColumn = require('./components/table_column.jsx');
TablePager = require('./components/table_pager.jsx');
TableSet = require('./components/table_set.jsx');

TableAttribute = require('./components/table_attribute.js.jsx');
DateTimeAttribute = require('./components/date_time_attribute.js.jsx');
BarPlotAttribute = require('./components/bar_plot_attribute.js.jsx');
BoxPlotAttribute = require('./components/box_plot_attribute.js.jsx');
LinePlotAttribute = require('./components/line_plot_attribute.js.jsx');
CheckboxAttribute = require('./components/checkbox_attribute.js.jsx');
ChildAttribute = require('./components/child_attribute.js.jsx');
DocumentAttribute = require('./components/document_attribute.js.jsx');
FloatAttribute = require('./components/float_attribute.js.jsx');
ForeignKeyAttribute = require('./components/foreign_key_attribute.js.jsx');
ImageAttribute = require('./components/image_attribute.js.jsx');
IntegerAttribute = require('./components/integer_attribute.js.jsx');
SelectAttribute = require('./components/select_attribute.js.jsx');
TextAttribute = require('./components/text_attribute.js.jsx');

plotActions = require('./actions/plot_actions.js');
timurActions = require('./actions/timur_actions.js');

PlotSeries = require('./components/plot_series.js.jsx');
PlotVarMapping = require('./components/plot_var_mapping.js.jsx');
PlotVariables = require('./components/plot_variables.js.jsx');
PlotCanvas = require('./components/plots/plot_canvas.js.jsx');
XAxis = require('./components/plots/xaxis.js.jsx');
YAxis = require('./components/plots/yaxis.js.jsx');
Legend = require('./components/plots/legend.js.jsx');

ScatterPlot = require('./components/plots/scatter_plot.jsx');
OneDScatterPlot = require('./components/plots/one_d_scatter_plot.jsx');
HeatmapPlot = require('./components/plots/heatmap_plot.jsx');
PlotConfig = require('./components/plots/plot_config.js.jsx');
PlotHeader = require('./components/plots/plot_header.jsx');

OneDScatterPlotContainer = require('./components/plots/one_d_scatter_plot_container.jsx');
ScatterPlotContainer = require('./components/plots/scatter_plot_container.js.jsx');
HeatmapPlotContainer = require('./components/plots/heatmap_plot_container.jsx');
ChainSelector = require('./components/chain_selector.js.jsx');
ListSelector = require('./components/list_selector.js.jsx');
ColorPicker = require('./components/color_picker.js.jsx');
Plotter = require('./components/plotter.js.jsx');

BarPlot = require('./components/plots/bar_plot.js.jsx');

Search = require('./components/search.js.jsx');
Timur = require('./components/timur.js.jsx');
