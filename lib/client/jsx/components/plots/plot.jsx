// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';
import { selectPlot, plotData } from '../../selectors/plot_selector';
import { MD5, selectConsignment } from '../../selectors/consignment_selector';
import { requestConsignments } from '../../actions/manifest_actions';
// import BarGraph from './plots/bar_plot/bar_graph';
// import BarPlot from './plotter/plots/bar_plot';
// import BoxGraph from './plots/box_plot/box_graph';
// import Histogram from '../plotter/plots/histogram';
import XYPlot from './xy_plot/xy_plot';
import CategoryPlot from './category_plot/category_plot';
// import StackedBarPlot from '../plotter/plots/stacked_bar_plot';
// import Swarm from '../plotter/plots/swarm';
// import TimelinePlot from './plots/timeline_plot/timeline_graph';

// script addendum helpers
const varName = (name, vname) => `${name}____${vname}`;

const seriesVars = (plot_series, vname) =>
  plot_series.map((s, index) => `@${varName(`series${index}`, vname)}`);

export const PLOTS = {
  xy: {
    name: 'xy',
    label: 'XY Plot',
    series_types: [
      {
        type: 'line',
        variables: { x: 'expression', y: 'expression', color: 'color_type' }
      },
      {
        type: 'scatter',
        variables: { x: 'expression', y: 'expression', color: 'color_type' }
      }
    ],
    variables: ['xdomain', 'ydomain'],
    addendum: plot_series => {
      let all_x = seriesVars(plot_series, 'x').join(', ');
      let all_y = seriesVars(plot_series, 'y').join(', ');

      return {
        xdomain: `[ min( concat( ${all_x})), max( concat( ${all_x})) ]`,
        ydomain: `[ min( concat( ${all_y})), max( concat( ${all_y})) ]`
      };
    }
  },
  category: {
    name: 'category',
    label: 'Category Plot',
    series_types: [
      {
        type: 'bar',
        variables: { value: 'expression', category: 'expression', color: 'color_type' },
      },
      {
        type: 'box',
        variables: { value: 'expression', category: 'expression', color: 'color_type' }
      }
    ],
    variables: ['domain'],
    addendum: plot_series => {
      let all_values = seriesVars(plot_series, 'value').join(', ');

      return {
        domain: `[ min( concat( ${all_values})), max( concat( ${all_values})) ]`,
      };
    }
  }
};

class Plot extends React.Component {
  componentDidMount() {
    let { data, requestConsignments, plot, inputs } = this.props;

    if (!data) {
      requestConsignments([plot.plotScript]);
    }
  }

  render() {
    let { plot, data, width } = this.props;

    if (!plot || !data) return null;

    let {
      plot_type,
      configuration: { layout }
    } = plot;
    let PlotComponent;
    switch (plot_type) {
      //   case 'boxplot':
      //     return null;
      //     PlotComponent = BoxGraph; break;
      //   case 'barplot':
      //     PlotComponent = BarPlot; break;
      //   case 'bargraph':
      //     return null;
      // PlotComponent = BarGraph; break;
      //   case 'stackedbar':
      //     PlotComponent = StackedBarPlot; break;
      //   case 'histogram':
      //     PlotComponent = Histogram; break;
      //   case 'swarm':
      //     PlotComponent = SwarmPlot; break;
      //   case 'scatter':
      //     PlotComponent = ScatterPlot; break;
      //   case 'heatmap':
      //     PlotComponent = HeatmapPlot; break;
      case 'xy':
        PlotComponent = XYPlot;
        break;
      case 'category':
        PlotComponent = CategoryPlot;
        break;
      default:
        return null;
    }

    return <PlotComponent data={data} layout={layout} parent_width={width} />;
  }
}

export default connect(
  // map state
  (state, { plot }) => {
    let consignment = plot
      ? selectConsignment(state, MD5(plot.plotScript))
      : null;
    let data = consignment ? plotData(plot, consignment) : null;
    return { plot, data };
  },
  // map dispatch
  { requestConsignments }
)(Plot);
