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
import LineGraph, {
  configureLineGraph
} from '../plotter_d3_v5/plots/line_plot/line_graph';
import XYPlot from '../plotter_d3_v5/plots/xy_plot/xy_plot';
import CategoryPlot from '../plotter_d3_v5/plots/category_plot/category_plot';
// import StackedBarPlot from '../plotter/plots/stacked_bar_plot';
// import Swarm from '../plotter/plots/swarm';
import Resize from './resize';
import TimelinePlot from './plots/timeline_plot/timeline_graph';

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
      case 'lineplot':
        PlotComponent = LineGraph;
        break;
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
