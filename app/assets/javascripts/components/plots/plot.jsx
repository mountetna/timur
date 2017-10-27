import React, { Component } from 'react';
import Scatter from './scatter';
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

    switch (plot.plotType) {
      case 'scatter':
        return (
          <div>
            <Scatter plot={plot} consignment={consignment} />
            <PlotMatrixResult plot={plot} consignment={consignment} />
          </div>
        );
      default:
        return <div></div>;
    }
  }
}

export default Plot;