// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';
import { selectPlot, plotScript, plotData } from '../../selectors/plot_selector';
import { MD5, selectConsignment } from '../../selectors/consignment_selector';
import { requestPlot } from '../../actions/plot_actions';
import { requestConsignments } from '../../actions/manifest_actions';
import BarGraph from '../plotter_d3_v5/plots/bar_plot/bar_graph';
import BarPlot from '../plotter/plots/bar_plot';
import BoxGraph from '../plotter_d3_v5/plots/box_plot/box_graph';
import Histogram from '../plotter/plots/histogram';
import LineGraph, { configureLineGraph } from '../plotter_d3_v5/plots/line_plot/line_graph';
import StackedBarPlot from '../plotter/plots/stacked_bar_plot';
import Swarm from '../plotter/plots/swarm';
import Resize from '../plotter_d3_v5/resize';
import TimelinePlot from '../plotter_d3_v5/plots/timeline_plot/timeline_graph';

class PlotAttribute extends React.Component {
  componentDidMount() {
    let {
      attribute, plot, data,
      document: { name: record_name },
      requestPlot, requestConsignments
    } = this.props;

    if (!plot && !data)
      requestPlot(
        attribute.plot_id,
        (plot) => requestConsignments([plotScript(plot, { record_name })])
      );
    else if (plot && !data)
      requestConsignments([plotScript(plot, { record_name })]);
  }

  render() {
    let { plot, data } = this.props;

    if (!plot || !data) return null;

    let { plot_type, configuration: { layout } } = plot;
    let PlotComponent, configure;
    switch(plot_type) {
      case "boxplot":
        return null;
        PlotComponent = BoxGraph; break;
      case "barplot":
        PlotComponent = BarPlot; break;
      case "bargraph":
        return null;
        PlotComponent = BarGraph; break;
      case "stackedbar":
        PlotComponent = StackedBarPlot; break;
      case "histogram":
        PlotComponent = Histogram; break;
      case "swarm":
        PlotComponent = SwarmPlot; break;
      case "lineplot":
        PlotComponent = LineGraph; break;
      case "scatter":
        PlotComponent = ScatterPlot; break;
      case "heatmap":
        PlotComponent = HeatmapPlot; break;
    }

    return(
      <div className='value'>
        <Resize render={width => (
          <PlotComponent data={data}
            layout={ layout }
          parent_width={width} />
        )}/>
      </div>
    )
  }
}

export default connect(
  // map state
  (state, {document: { name: record_name }, attribute: { plot_id }}) => {
    let plot = selectPlot(state, plot_id, { record_name });
    let consignment = plot ? selectConsignment(state, MD5(plot.plotScript)) : null;
    let data = consignment ? plotData(plot, consignment) : null;
    return { plot, data };
  },
  // map dispatch
  { requestPlot, requestConsignments }
)(PlotAttribute);
