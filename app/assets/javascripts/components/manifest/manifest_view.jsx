import { Component } from 'react'
import ManifestElement from './manifest_element'
import ManifestPreview from './manifest_preview'
import Plotter from './plotter'
import ToggleSwitch from '../toggle_switch'
import { requestConsignments } from '../../actions/consignment_actions'
import { selectConsignment } from '../../selectors/consignment'
import { manifestToReqPayload, deleteManifest, toggleEdit, copyManifest } from '../../actions/manifest_actions'

// Shows a single manifest - it has two states, 'script', which
// shows the manufest script, and 'output', which shows the
// resulting data. Sends a request for a consignment when 'output'
// is clicked if none exists.
class ManifestView extends Component {
  constructor() {
    super()
    this.state = {
      view_mode: 'script',
      plot: false
    }
  }

  render() {
    const { manifest, consignment, deleteManifest, toggleEdit, copyManifest } = this.props
    const { is_editable, name } = manifest

    const elements =  manifest.data.elements || []

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
            {is_editable &&
              <button onClick={handleEdit}>
                <i className='fa fa-pencil-square-o' aria-hidden="true"></i>
                edit
              </button>
            }
            {this.state.view_mode === 'output' &&
              <button onClick={() => this.setState({plot: !this.state.plot})}>
                <i className='fa fa-line-chart' aria-hidden="true"></i>
                plot
              </button>
            }
            <button onClick={() => copyManifest(manifest)}>
              <i className='fa fa-files-o' aria-hidden="true"></i>
              copy
            </button>
            {is_editable &&
              <button onClick={() => deleteManifest(manifest.id)}>
                <i className='fa fa-trash-o' aria-hidden="true"></i>
                delete
              </button>
            }
          </div>
          <ManifestPreview {...manifest} />
          {this.state.plot && <Plotter data={manifest.result} />}
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
