import React, { Component } from 'react'

export default class ManifestElement extends Component {
  componentDidMount() {
    this.setState({ key:'', value:'' })
  }

  updateKey(e) {
    this.setState({ ...this.state, key: e.target.value })
  }

  updateValue(e) {
    this.setState({ ...this.state, value: e.target.value })
  }

  handleUpdateClick() {
    this.props.updateClick(this.state)
  }

  render() {
    return (
      <div className='element-editor-container'>
        <div className='element-editor'>
          <div>
            <label>Name: </label>
            <input type='text' onChange={this.updateKey.bind(this)}></input>
          </div>
          <div className='expression-section'>
            <label>Expression:</label>
            <textarea onChange={this.updateValue.bind(this)}></textarea>
          </div>
          <div className='button-container'>
            <div className='cancel' onClick={this.props.cancelClick}>
              <i className="fa fa-ban" aria-hidden="true"></i>
              Cancel
            </div>
            <div className='update' onClick={this.handleUpdateClick.bind(this)}>
              <i className="fa fa-plus" aria-hidden="true"></i>
              Add
            </div>
          </div>
        </div>
      </div>
    )
  }
}