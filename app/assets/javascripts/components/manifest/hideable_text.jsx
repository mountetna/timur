import React, { Component } from 'react'

class HideableText extends Component {
  componentWillMount() {
    this.setState({ hidden: true })
  }

  toggle() {
    this.setState({ hidden: !this.state.hidden })
  }

  display() {
    return this.state.hidden ? 'none' : 'initial'
  }

  label() {
    if (this.state.hidden) {
      return <span>See {this.props.label} <i className="fa fa-caret-down" aria-hidden="true"></i></span>
    }
    return <span>See less <i className="fa fa-caret-up" aria-hidden="true"></i></span>
  }

  render() {
    return (
      <div className='hideable-text'>
        <text style={{ display: this.display() }}>{this.props.text}</text>
        <div className='label' onClick={this.toggle.bind(this)}>
          {this.label()}
        </div>
      </div>
    )
  }
}

export default HideableText