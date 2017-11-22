import React, { Component } from 'react';
import Scatter from './scatter';
import Heatmap from './heatmap';
import PlotMatrixResult from './plot_matrix_result';

class Plot extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.plot != nextProps.plot || this.props.consignment != nextProps.consignment;
  }

  render() {
    const { plot, consignment } = this.props;

    if (!consignment || !plot) {
      return <div></div>;
    }

    switch (plot.plot_type) {
      case 'scatter':
        return (
          <div>
            <Scatter plot={plot} consignment={consignment} />
            <PlotMatrixResult plot={plot} consignment={consignment} />
          </div>
        );
      case 'heatmap':
        return <Heatmap plot={plot} consignment={consignment} />
      default:
        return <div></div>;
    }
  }
}

export default Plot;