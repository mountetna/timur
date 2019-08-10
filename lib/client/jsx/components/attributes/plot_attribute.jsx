// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';
import { selectPlot } from '../../selectors/plot_selector';
import { requestPlot } from '../../actions/plot_actions';
import Plot from '../plots/plot';
import Resize from '../resize';
class PlotAttribute extends React.Component {
  componentDidMount() {
    let {
      attribute, plot,
      document: { name: record_name },
      requestPlot
    } = this.props;

    if (!plot){
      requestPlot(attribute.plot_id);
    }
  }

  render() {
    let { plot } = this.props;
    if (!plot) return null;
    return(
      <div className='attribute'>
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
    let { record_name, attribute: { plot_id }} = props;
    let plot = selectPlot(state, plot_id, { record_name });
    return { plot };
  },
  // map dispatch
  { requestPlot}
)(PlotAttribute);
