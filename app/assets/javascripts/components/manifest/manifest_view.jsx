import { Component } from 'react'
import ManifestElement from './manifest_element'
import ManifestPreview from './manifest_preview'
import ToggleSwitch from '../toggle_switch'
import { requestConsignments } from '../../actions/consignment_actions'
import { selectConsignment } from '../../selectors/consignment'
import { manifestToReqPayload, deleteManifest, toggleEdit, copyManifest } from '../../actions/manifest_actions'

class ManifestView extends Component {
  constructor() {
    super()
    this.state = { view_mode: 'script' }
  }

  render() {
    const { manifest, consignment, deleteManifest, toggleEdit, copyManifest } = this.props
    const { is_editable, name } = manifest

    const elements =  manifest.data.elements || []

    console.log("Consignment is")
    console.log(consignment)

    const manifestElements = elements.map((element, i) => {
      let elementResult
      if (consignment) {
        if (consignment[element.name]) {
          elementResult = consignment[element.name]
        } else if (consignment && !consignment[element.name]) {
          elementResult = ''
        } 
      } else {
        elementResult = ''
      }
      const props = { ...element, result: elementResult, view_mode: this.state.view_mode }
      return (
        <li key={i}>
          <ManifestElement {...props}/>
        </li>
      )
    })

    return (
      <div className='manifest'>
        <div className='manifest-elements'>
          <div className='actions'>
            { is_editable &&
              <button onClick={toggleEdit}>
                <i className='fa fa-pencil-square-o' aria-hidden="true"></i>
                edit
              </button>
            }
            <button onClick={() => copyManifest(manifest)}>
              <i className='fa fa-files-o' aria-hidden="true"></i>
              copy
            </button>
            { is_editable &&
                <button onClick={ () => deleteManifest(manifest.id)}>
              <i className='fa fa-trash-o' aria-hidden="true"></i>
              delete
            </button>
            }
          </div>
          <ManifestPreview {...manifest} />
          <ToggleSwitch 
            id="view_mode_switch"
            caption="Show"
            onChange={ (view_mode) => {
              this.setState({ view_mode })
              if (view_mode == 'output' && !consignment) {
                if (!consignment) this.props.requestConsignments([manifestToReqPayload(manifest)])
              }
            } }
            selected={this.state.view_mode}
            values={[ 'script', 'output' ]}
          />
          <ol>
            {manifestElements}
          </ol>
        </div>
      </div>
    )
  }
}

export default connect(
  (state,props) => ({
    consignment: selectConsignment(state,props.manifest.name)
  }),
  {
    deleteManifest,
    copyManifest,
    toggleEdit,
    requestConsignments
  }
)(ManifestView)
