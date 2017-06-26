import { Component } from 'react'
import ManifestElement from './manifest_element'
import ManifestPreview from './manifest_preview'
import ToggleSwitch from '../toggle_switch'
import { requestConsignments } from '../../actions/consignment_actions'
import { selectConsignment } from '../../selectors/consignment'
import { manifestToReqPayload, deleteManifest, toggleEdit, copyManifest } from '../../actions/manifest_actions'
import Vector from '../../vector'
import Matrix from '../../matrix'

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

  consignmentToSeriesMap(consignment) {
    return Object.keys(consignment).reduce((plotableSeries, elementName) => {
      const consignmentValue = consignment[elementName]

      if (Array.isArray(consignmentValue)) {
        return {
          ...plotableSeries,
          ['@' + elementName]: consignmentValue
        }
      } else if (consignmentValue instanceof Vector) {
        return {
          ...plotableSeries,
          ['@' + elementName]: consignmentValue.values
        }
      } else if (consignmentValue instanceof Matrix) {
        const matrixColumns = consignmentValue.col_names.reduce((plotableColumns, columnName, i) => {
          const seriesName = '@' + elementName + '$' + columnName
          const series = consignmentValue.col(i)
          return {
            ...plotableColumns,
            [seriesName]: series
          }
        }, {})

        return { ...plotableSeries, ...matrixColumns }
      }
    }, {})
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
              <button onClick={toggleEdit}>
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
