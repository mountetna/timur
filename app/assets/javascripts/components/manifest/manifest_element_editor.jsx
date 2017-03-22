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

        <div style={{
          borderWidth: 1, 
          borderStyle: 'solid', 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: 'grey',
          padding: 10
        }}>
          <div>
            <label>Name: </label>
            <input type='text' onChange={this.updateKey.bind(this)}></input>
          </div>
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <label>Expression:</label>
            <textarea style={{resize: 'vertical', minHeight: 300}} onChange={this.updateValue.bind(this)}></textarea>
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}>
            <div onClick={this.props.cancelClick}>
              <i className="fa fa-ban" aria-hidden="true"></i>
              Cancel
            </div>
            <div onClick={this.handleUpdateClick.bind(this)}>
              <i className="fa fa-plus" aria-hidden="true"></i>
              Add
            </div>
          </div>
        </div>
    )
  }
}