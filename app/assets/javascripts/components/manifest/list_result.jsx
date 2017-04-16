import React, { Component } from 'react'
import { downloadTSV } from '../../tsv'

class List extends Component {
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
    return this.props.dataList.map((data, index) =>
      <tr key={index}>
        <td>{data.label}</td>
        <td>{data.value}</td>
      </tr>
    )
  }

  render() {
    return (
      <div className='list'>
        <span className='label'>@{this.props.name}</span><i className="fa fa-list" aria-hidden="true"></i> -
        <i className="fa fa-download blue-on-hover" aria-hidden="true" onClick={() => downloadTSV(this.props.dataList, ['label', 'value'], this.props.name)}></i>
        {this.props.dataList.length + ' items'}
        <span  className='underline-on-hover toggle' onClick={this.toggle.bind(this)}>
          {this.state.hidden ? ' show' : ' hide' }
        </span>
        <div>
          <table style={{ display : this.display() }}>
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

export default List