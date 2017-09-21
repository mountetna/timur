import { Component } from 'react'
import { toggleEdit, selectManifest} from '../../actions/manifest_actions'

// Selection item for a single manifest
const Selection = (select) => (id, title, name) => {
  return <li key={id}>
    <div className='selection'>
      <a href='#' 
        onClick={
          () => select(id) 
        }
        title={ title }>
        <span className='name'>{name}</span>
      </a>
    </div>
  </li>
}

// Collection of selection items for all manifests
class ListSelector extends Component {
  renderList() {
    let { sections, items } = this.props

    if (sections)
      return Object.keys(sections).map(section_name => ListSection(section_name, sections[section_name]))
    else if (items)
      return items.map(item => ListItem(item))
    return null
  }

  render() {
    let { public_manifests, private_manifests, newManifest = true } = this.props
    return (
      <div className='manifests-selector'>
        {
          newManifest &&
          <a href='#' onClick={ () => this.props.selectManifest(null) && this.props.toggleEdit() } className="new">
            <i className="fa fa-plus" aria-hidden="true"></i>
            New Manifest
          </a>
        }
        <div>
          {
            renderList()
            sections.map(section => ListSection(section))
          }
        </div>
      </div>
    )
  }
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
