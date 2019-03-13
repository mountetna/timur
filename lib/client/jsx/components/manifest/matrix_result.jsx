// Framework libraries.
import * as React from 'react';
import * as TSV from '../../utils/tsv';
import ConsignmentResult from './consignment_result';
import ResultTable from './result_table';

class MatrixResult extends React.Component{
  downloadMatrix() {
    let {name, matrix} = this.props;
    let matrix_map = matrix.map('row', (row, _, row_name)=>{
      return matrix.col_names.reduce(
        (row_obj, col_name, i)=>{
          return {...row_obj, [col_name]: row[i]};
        },
        {row_names: row_name}
      );
    });

    TSV.downloadTSV(
      matrix_map,
      ['row_names'].concat(matrix.col_names),
      name
    );
  }

  render(){
    let {matrix} = this.props;

    let columns = [
      {
        Header: 'Row Names',
        accessor: 'row_name'
      }, ...matrix.col_names.map(
        header => (
          {
            Header: header,
            accessor: header,
            Cell: ({value}) => <ConsignmentResult data={ value } />
          }
        )
      )
    ];

    let data = matrix.map('row', (row, index, row_name) => (
      {
        row_name, ...row.reduce(
          (row_data, value, col_index) => {
            row_data[matrix.col_names[col_index]] = value; return row_data
          }, {}
        )
      }
    ));

    return <ResultTable
      data={ data }
      columns={ columns }
      onDownload={this.downloadMatrix.bind(this)}
      className='fas fa-table'
      text={`(${matrix.num_rows}x${matrix.num_cols})`} />;
  }
}

export default MatrixResult;
