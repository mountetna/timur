// Framework libraries.
import * as React from 'react';
import * as TSV from '../../utils/tsv';

class MatrixResult extends React.Component{
  componentWillMount(){
    this.setState({hidden: true});
  }

  toggle(){
    this.setState({hidden: !this.state.hidden});
  }

  display(){
    return this.state.hidden ? 'none' : 'initial';
  }

  header(){
    let header_cells = this.props.matrix.col_names.map((col_name, index)=>{
      return <th key={index}>{col_name}</th>
    });

    return(
      <tr>
        <th>{'Row Names'}</th>
        {header_cells}
      </tr>
    );
  }

  tableRows(){
    return this.props.matrix.map('row', (row, index, row_name)=>{
      return(
        <tr key={index}>

          <td>{row_name}</td>
          {row.map((data, index)=>(<td key={index}>{data}</td>))}
        </tr>
      );
    });
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

  render(){
    let {matrix} = this.props;
    return(
      <div className='consignment-matrix'>

        {`Table Data: ${matrix.num_rows} rows x ${matrix.num_cols} cols`}
        <button className='consignment-btn' onClick={this.downloadMatrix.bind(this)}>
          
          <i className='fa fa-download' aria-hidden='true' ></i>
          {' DOWNLOAD'}
        </button>
        <button className='consignment-btn' onClick={this.toggle.bind(this)}>

          <i className='fa fa-table' aria-hidden='true'></i>
          {this.state.hidden ? ' SHOW' : ' HIDE'}
        </button>
        <div style={{display : this.display()}}>

          <table className='consignment-table'>

            <thead>

              {this.header()}
            </thead>
            <tbody>

              {this.tableRows()}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default MatrixResult;
