import React, { Component } from 'react'
import { connect } from 'react-redux'
import ManifestTitle from './title'
import { submitManifest, saveManifest, toggleIsManifestSelectorVisible, selectManifest} from '../../actions/manifest_editor_actions'

const Titlebar = ({ submitManifest, saveManifest, toggleIsManifestSelectorVisible, manifestList, isManifestSelectorVisible, selectManifest, title}) => (
  <div className='title-bar-container' >
    <ManifestTitle />
    <div className='actions-container'>
      <div onClick={toggleIsManifestSelectorVisible}>
        Open
        <i className="fa fa-folder-open" aria-hidden="true"></i>
      </div> 
      {isManifestSelectorVisible &&
        <div>
          <select defaultValue={title} onChange={(e) => selectManifest(e.target.value)}>
            <option value={''}>new manifest</option>
            {manifestList.map(manifest => <option key={manifest} value={manifest}>{manifest}</option>)}
          </select>
        </div>
      }
      <div onClick={saveManifest}>
        Save
        <i className="fa fa-floppy-o" aria-hidden="true"></i>
      </div>
      <div onClick={submitManifest}>
        Submit
        <i className="fa fa-paper-plane" aria-hidden="true"></i>
      </div>
    </div>
  </div>
)

const mapStateToProps = (state) => ({
  manifestList: Object.keys(state.manifests),
  isManifestSelectorVisible: state.manifestEditor.isManifestSelectorVisible,
  title: state.manifestEditor.title
})

export default connect(
  mapStateToProps, 
  { submitManifest, saveManifest, toggleIsManifestSelectorVisible, selectManifest }
)(Titlebar)