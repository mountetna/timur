import React, { Component } from 'react'

export default class ManifestElement extends Component {
  componentWillMount() {
    const { name, expression } = this.props
    this.setState({
      originalKey: this.props.name,
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
    const { key, value } = this.state
    const confirmIconAndText = this.props.name ? {icon: 'fa fa-check', text: 'Update'} : {icon: 'fa fa-plus', text: 'Add'}

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
              <i className={confirmIconAndText.icon} aria-hidden="true"></i>
              {confirmIconAndText.text}
            </div>
          </div>
        </div>
      </div>
    )
  }
}