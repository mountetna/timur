// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';
import { selectPlot } from '../../../selectors/plot_selector';
import { requestPlot } from '../../../actions/plot_actions';
import Plot from '../../plots/plot';
import Resize from '../../resize';

class PlotItem extends React.Component {
  componentDidMount() {
    let { item, plot, requestPlot } = this.props;

    if (!plot) {
      requestPlot(item.plot_id);
    }
  }

  render() {
    let { plot } = this.props;
    if (!plot) return null;

    return(
      <div className='item'>
        <Resize render={width => (
          <Plot plot={plot} width={width} />
        )}/>
      </div>
    )
  }
}

export default connect(
  // map state
  (state, props) => {
    let { record_name, item: { plot_id }} = props;
    let plot = selectPlot(state, plot_id, { record_name });
    return { plot };
  },
  // map dispatch
  { requestPlot}
)(PlotItem);
