import React, { Component } from 'react'
import { connect } from 'react-redux'
import Toolbar from './toolbar'
import ManifestElementEditor from './manifest_element_editor'
import ManifestElements from './manifest_elements'
import { updateManifest, toggleManifestElementEditor, addManifestElement } from '../../actions/manifest_editor_actions'

const mapStateToProps = (state) => ({
  manifest: state.manifestEditor.manifest,
  isEditingElement: state.manifestEditor.isEditingManifestElement
})

class Editor extends Component {
  handleManifestUpdate(e) {
    this.props.onManifestChange(e.target.value)
  }

  render() {
    return (
      <div className='manifest-container' >
        <Toolbar />
        <ManifestElements />
        <div className='action-container' >

          <ManifestElementEditor cancelClick={this.props.toggleManifestElementEditor} updateClick={this.props.addManifestElement}/>
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps, 
  { 
    onManifestChange: updateManifest,
    toggleManifestElementEditor,
    addManifestElement
  }
)(Editor)

//<textarea value={this.props.manifest} style={textAreaStyle} onChange={this.handleManifestUpdate.bind(this)}></textarea>
          // <div onClick={this.props.toggleManifestElementEditor}>
          //   <i className="fa fa-plus" aria-hidden="true" ></i>
          //   Manifest Element
          // </div>