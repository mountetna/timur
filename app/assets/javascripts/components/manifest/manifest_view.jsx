import { Component } from 'react'
import ManifestElement from './manifest_element'
import ManifestPreview from './manifest_preview'
import ToggleSwitch from '../toggle_switch'
import { requestConsignments } from '../../actions/consignment_actions'
import { selectConsignment } from '../../selectors/consignment'
import { manifestToReqPayload, deleteManifest, toggleEdit, copyManifest } from '../../actions/manifest_actions'
import { plotsByIds } from '../../reducers/plots_reducer'
import { selectPlot, toggleEditing as plotEdit } from '../../actions/plot_actions'
import { plotIndexUrl } from '../../api/plots'

// Shows a single manifest - it has two states, 'script', which
// shows the manufest script, and 'output', which shows the
// resulting data. Sends a request for a consignment when 'output'
// is clicked if none exists.
class ManifestView extends Component {
  constructor() {
    super()
    this.state = { view_mode: 'script' }
  }

  render() {
    const { manifest, consignment, deleteManifest, toggleEdit, copyManifest, project_name } = this.props
    const { is_editable } = manifest

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
              <button onClick={toggleEdit}>
                <i className='fa fa-pencil-square-o' aria-hidden="true"></i>
                edit
              </button>
            }
            {this.state.view_mode === 'output' && manifest.is_editable &&
              <button>
                <a href={plotIndexUrl(project_name, { manifest_id: manifest.id, is_editing: true })}>
                  <i className='fa fa-line-chart' aria-hidden="true"></i>
                  plot
                </a>
              </button>
            }
            <button onClick={() => copyManifest(this.props.project, manifest)}>
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
          {this.state.view_mode === 'output' &&
            <div>
              <div>{'Plots: '}</div>
              <ul>
                {this.props.plots.map(plot => (
                  <li key={plot.id}>
                    <a href={plotIndexUrl(project_name, { manifest_id: manifest.id, id: plot.id })}>
                      {plot.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          }
        </div>
      </div>
    )
  }
}

export default connect(
  (state,props) => ({
    consignment: selectConsignment(state, props.manifest.name),
    plots: plotsByIds(state.plots, props.manifest.plotIds || [])
  }),
  {
    deleteManifest,
    copyManifest,
    toggleEdit,
    requestConsignments,
    selectPlot,
    plotEdit
  }
)(ManifestView)
