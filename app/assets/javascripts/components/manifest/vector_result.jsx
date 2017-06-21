import React, { Component } from 'react'
import { downloadTSV } from '../../utils/tsv'

class VectorResult extends Component {
  componentWillMount() {
    this.setState({ hidden: true })
  }

  toggle() {
    this.setState({ hidden: !this.state.hidden })
  }

  display() {
    return this.state.hidden ? 'none' : 'initial'
  }

  tableRows() {
    return this.props.vector.map((label, value, index) =>
      <tr key={index}>
        <td>{label}</td>
        <td>{value}</td>
      </tr>
    )
  }

  render() {
    return (
      <div className='vector'>
        <i className="fa fa-list" aria-hidden="true"></i>
        <i className="fa fa-download" aria-hidden="true" onClick={() => downloadTSV(this.props.vector.map((label,value) => ({ label, value })), ['label', 'value'], this.props.name)}></i>
        {this.props.vector.size + ' items'}
        <span  className='underline-on-hover toggle' onClick={this.toggle.bind(this)}>
          {this.state.hidden ? 'show' : 'hide' }
        </span>
        <div style={{ display : this.display() }}>
          <table>
            <thead>
            <tr>
              <th>label</th>
              <th>value</th>
            </tr>
            </thead>
            <tbody>{this.tableRows()}</tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default VectorResult
