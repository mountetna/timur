// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';
import { selectPlot } from '../../selectors/plot_selector';
import { plotData } from '../../plots/plot_script';
import { MD5, selectConsignment } from '../../selectors/consignment_selector';
import { requestConsignments } from '../../actions/manifest_actions';
import XYPlot from './xy_plot/xy_plot';
import CategoryPlot from './category_plot/category_plot';

export const empty = (i) => i==null||i==undefined||i=='';

export const validDomain = (min,max,vector) =>
  !empty(min) && !empty(max) ? [ parseFloat(min), parseFloat(max) ] :
    vector.values;

class Plot extends React.Component {
  componentDidMount() {
    let { data, requestConsignments, plot, inputs } = this.props;

    if (!data && plot.script) {
      requestConsignments([plot.plotScript]);
    }
  }

  render() {
    let { plot, data, width } = this.props;

    if (!plot || !data) return null;

    let {
      plot_type,
      configuration: { layout, variables }
    } = plot;
    let PlotComponent;
    switch (plot_type) {
      case 'xy':
        PlotComponent = XYPlot;
        break;
      case 'category':
        PlotComponent = CategoryPlot;
        break;
      default:
        return null;
    }

    return <PlotComponent data={data} plot={plot} config_variables={ variables } layout={layout} parent_width={width} />;
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
