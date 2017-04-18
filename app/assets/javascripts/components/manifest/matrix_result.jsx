import React, { Component } from 'react'
import { matrixConversion, downloadTSV } from '../../tsv'

class Matrix extends Component {
  componentWillMount() {
    this.setState({ hidden: true })
  }

  toggle() {
    this.setState({ hidden: !this.state.hidden })
  }

  display() {
    return this.state.hidden ? 'none' : 'initial'
  }

  columnsRow() {
    return (
      <tr>
        <th>row_names</th>
        {this.props.col_names.map((columnName, index) => <th key={index}>{columnName}</th>)}
      </tr>
    )
  }

  tableRows() {
    return this.props.rows.map((row, index) => (
      <tr key={index}>
        <td>{this.props.row_names[index]}</td>
        { row.map((data, index) => <td key={index}>{data}</td>) }
      </tr>
    ))
  }

  downloadMatrix() {
    const { rows, col_names, name} = this.props
    downloadTSV(
      matrixConversion(rows, col_names),
      col_names,
      name
    )
  }

  render() {
    return (
      <div className='list'>
        <span className='label'>@{this.props.name}</span>
        <i className="fa fa-table" aria-hidden="true"></i> -
        <i className="fa fa-download blue-on-hover" aria-hidden="true" onClick={this.downloadMatrix.bind(this)}></i>
        {this.props.rows.length + ' rows'}
        <span  className='underline-on-hover toggle' onClick={this.toggle.bind(this)}>
          {this.state.hidden ? ' show' : ' hide' }
        </span>
        <div>
          <table style={{ display : this.display() }}>
            <thead>
            {this.columnsRow()}
            </thead>
            <tbody>
            {this.tableRows()}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Matrix