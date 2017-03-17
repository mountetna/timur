import React, { Component } from 'react'
import { connect } from 'react-redux'
import Toolbar from './toolbar'
import { updateManifest } from '../../actions/manifest_editor_actions'

const mapStateToProps = (state) => ({
  manifest: state.manifestEditor.manifest
})

class Editor extends Component {
  handleManifestUpdate(e) {
    this.props.onManifestChange(e.target.value)
  }

  render() {
    const containerStyle = {
      marginLeft: 15, 
      marginRight: 15, 
      marginTop: 15, 
      display: 'flex', 
      flexDirection: 'column'
    }

    const textAreaStyle = {
      width: '100%', 
      height: 200, 
      padding:0, 
      boxSizing:'border-box', 
      maxWidth: '100%', 
      resize: 'vertical'
    }
    return (
      <div style={containerStyle}>
        <Toolbar />
        <div>
          <textarea value={this.props.manifest} style={textAreaStyle} onChange={this.handleManifestUpdate.bind(this)}></textarea>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps, 
  { onManifestChange: updateManifest }
)(Editor)