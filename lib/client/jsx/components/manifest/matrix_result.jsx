// Framework libraries.
import * as React from 'react';
import * as TSV from '../../utils/tsv';
import ConsignmentTable from './consignment_table';

class MatrixResult extends React.Component{
  constructor(props) {
    super(props);
    this.state = { hidden: true };
  }

  toggle() {
    this.setState({hidden: !this.state.hidden});
  }

  downloadMatrix(){
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

  table() {
    let { matrix } = this.props;
    let headers = [ 'Row Names', ...matrix.col_names ];
    let rows = matrix.map('row', (row, index, row_name)=>[ row_name, ...row ]);

    return <ConsignmentTable headers={ headers } rows={ rows }/>
  }

  render(){
    let {matrix} = this.props;
    let {hidden} = this.state;
    return(
      <div className='consignment-matrix'>
        <i className='fa fa-table'/>

        {` ${matrix.num_rows} rows x ${matrix.num_cols} cols`}

        <button className='consignment-btn' onClick={this.downloadMatrix.bind(this)}>
          <i className='fa fa-download' aria-hidden='true' ></i>
          {'DOWNLOAD'}
        </button>
        <button className='consignment-btn' onClick={this.toggle.bind(this)}>
          <i className='fa fa-table' aria-hidden='true'></i>
          { hidden ? 'SHOW' : 'HIDE'}
        </button>
        { !hidden && this.table() }
      </div>
    );
  }
}

export default MatrixResult;
