import React from 'react';
import { connect } from 'react-redux';
import MatrixResult from '../manifest/matrix_result';
import Matrix from '../../models/matrix'

let PlotMatrixResult = ({ plot, consignment, selectedPoints }) => {
  const matrix = consignment[plot.selectedReferenceTable];

  if (matrix instanceof Matrix) {
    const filteredMatrix = matrix.filter('row', (row, i, rowName) => selectedPoints.includes(rowName));
    return <MatrixResult matrix={filteredMatrix} name={plot.selectedReferenceTable} />;
  }

  return <div></div>;
}

export default connect(
  (state) => ({ selectedPoints: state.plots.selectedPoints })
)(PlotMatrixResult)