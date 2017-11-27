import React, { Component } from 'react'
import { downloadTSV } from '../../utils/tsv'

class MatrixResult extends Component {
  componentWillMount() {
    this.setState({ hidden: true })
  }

  toggle() {
    this.setState({ hidden: !this.state.hidden })
  }

  display() {
    return this.state.hidden ? 'none' : 'initial'
  }

  header() {
    return (
      <tr>
        <th>row_names</th>
        {this.props.matrix.col_names.map((col_name, index) => <th key={index}>{col_name}</th>)}
      </tr>
    )
  }

  tableRows() {
    return this.props.matrix.map('row', (row, index, row_name) => (
      <tr key={index}>
        <td>{row_name}</td>
        { row.map((data, index) => <td key={index}>{data}</td>) }
      </tr>
    ))
  }

  downloadMatrix() {
    const { name, matrix } = this.props
    downloadTSV(
      matrix.map(
        'row',
        (row, _, row_name) => matrix.col_names.reduce(
          (row_obj, col_name, i) => ({...row_obj, [col_name]: row[i]}),
          { row_names: row_name }
        )
      ),
      [ 'row_names' ].concat(matrix.col_names),
      name
    )
  }

  render(){
    const {matrix} = this.props;
    return(
      <div className='consignment-matrix'>
        {`Table Data: ${matrix.num_rows} rows x ${matrix.num_cols} cols`}
        <button className='consignment-btn' onClick={this.downloadMatrix.bind(this)}>
          
          <i className="fa fa-download" aria-hidden="true" ></i>
          {' DOWNLOAD'}
        </button>
        <button className='consignment-btn' onClick={this.toggle.bind(this)}>

          <i className="fa fa-table" aria-hidden="true"></i>
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
