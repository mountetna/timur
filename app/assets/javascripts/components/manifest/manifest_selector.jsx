import { Component } from 'react'
import { toggleEdit, selectManifest} from '../../actions/manifest_actions'
import ListSelector from '../list_selector'

// Collection of selection items for all manifests
class ManifestSelector extends Component {
  create() {
    this.props.selectManifest(null);
    this.props.toggleEdit()
  }

  render() {
    let { public_manifests, private_manifests, newManifest = true } = this.props
    let sections = { Public: public_manifests, Private: private_manifests }
    return (
      <ListSelector
        name="Manifest"
        create={ this.create.bind(this) }
        select={ this.props.selectManifest }
        sections={ sections }/>
    )
  }
}

export default connect(
  (state, props) => {
    return {
      public_manifests: props.manifests.filter((m) => m.access == 'public').sort((a,b) => a > b),
      private_manifests: props.manifests.filter((m) => m.access == 'private').sort((a,b) => a > b),
    }
  },
  { toggleEdit, selectManifest }
)(ManifestSelector)
