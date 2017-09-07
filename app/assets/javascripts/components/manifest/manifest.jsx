import React, { Component } from 'react'
import ManifestForm from './manifest_form'
import ManifestView from './manifest_view'

export default class Manifest extends Component {
  render () {
    return (
      <div className='manifest-container'>
        { this.props.editing ?
          <ManifestForm
            isAdmin={this.props.isAdmin}
            manifest={this.props.manifest} /> :
          <ManifestView
            manifest={this.props.manifest} />
        }
      </div>
    )
  }
}
