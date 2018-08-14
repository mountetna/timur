// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';
import { requestPlot } from '../../actions/plot_actions';
import { requestConsignments } from '../../actions/manifest_actions';

// The basic plot attribute - it renders ALL plots using plot.plot_type
class PlotAttribute extends React.Component {
  componentDidMount() {
    let {
      document,
      template,
      attribute,
      plot,
      consignment
    } = this.props;

    if (!plot && !consignment)
      requestPlot(
        attribute.plot_id,
        (plot)=> requestConsignments([plot.script])
      )
    else if (plot && !consignment)
      requestConsignments([plot.script])
  }

  render() {
    let { plot, consignment } = this.props;

    if (!plot) return null;

    let { plot_type, configuration } = plot;

    let PlotComponent;
    switch(plot_type) {
      case "boxplot":
        PlotComponent = BoxPlot; break;
      case "barplot":
        PlotComponent = BarPlot; break;
      case "bargraph":
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
          <PlotComponent
            configuration={configuration}
            consignment={consignment}
          parent_width={width} />
        )}/>
      </div>
    )
  }
}

export default connect(
  null,
  { requestPlot, requestConsignments }
)(PlotAttribute);
