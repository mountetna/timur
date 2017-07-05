import { Component } from 'react'
import { toggleEdit, selectManifest} from '../../actions/manifest_actions'

// Selection item for a single manifest
const ManifestSelection = (selectManifest) => (manifest) => {
  return <li key={manifest.id}>
    <div className='manifest-selection'>
      <a href='#' 
        onClick={
          () => selectManifest(manifest.id) 
        }
        title={ manifest.description }>
        <span className='name'>{manifest.name}</span>
      </a>
    </div>
  </li>
}

// Collection of selection items for all manifests
class ManifestSelector extends Component {
  render() {
    let { public_manifests, private_manifests } = this.props
    return <div className='manifests-selector'>
      <a href='#' onClick={ () => this.props.selectManifest(null) && this.props.toggleEdit() } className="new">
        <i className="fa fa-plus" aria-hidden="true"></i>
        New Manifest
      </a>
      <div>
      <span className="title">Public</span>
      <ol>
        {
          public_manifests.map(ManifestSelection(this.props.selectManifest))
        }
      </ol>
      <span className="title">Private</span>
      <ol>
        {
          private_manifests.map(ManifestSelection(this.props.selectManifest))
        }
      </ol>
      </div>
    </div>
  }
}

export default connect(
  (state, props) => {
    return {
      public_manifests: Object.values(props.manifests).filter((m) => m.access == 'public').sort((a,b) => a > b),
      private_manifests: Object.values(props.manifests).filter((m) => m.access == 'private').sort((a,b) => a > b),
    }
  },
  { toggleEdit, selectManifest }
)(ManifestSelector)
