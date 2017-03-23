import React, { Component } from 'react'

export default class ManifestElement extends Component {
  componentWillMount() {
    const { name, expression } = this.props
    this.setState({ 
      key: name || '', 
      value: expression || '' 
    })
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
    console.log(this.state)
    const { key, value } = this.state

    return (
      <div className='element-editor-container'>
        <div className='element-editor'>
          <div>
            <label>Name: </label>
            <input type='text' onChange={this.updateKey.bind(this)} value={key}></input>
          </div>
          <div className='expression-section'>
            <label>Expression:</label>
            <textarea onChange={this.updateValue.bind(this)} value={value}></textarea>
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