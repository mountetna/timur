import { Component } from 'react'
import ManifestElement from './manifest_element'
import ManifestPreview from './manifest_preview'
import ToggleSwitch from '../toggle_switch'

export default class ManifestView extends Component {
  constructor() {
    super()
    this.state = { view_mode: 'script' }
  }

  render() {
    const { manifest, handleDelete, handleEdit, handleCopy, back} = this.props
    const { is_editable, result, name } = manifest

    const elements =  manifest.data.elements || []

    const manifestElements = elements.map((element, i) => {
      let elementResult
      if (result) {
        if (result[name] && result[name][element.name]) {
          elementResult = result[name][element.name]
        } else if (result[name] && !result[name][element.name]) {
          elementResult = ''
        } else if (!result[name]) {
          elementResult = result
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
              <button onClick={handleEdit}>
                <i className='fa fa-pencil-square-o' aria-hidden="true"></i>
                edit
              </button>
            }
            <button onClick={handleCopy}>
              <i className='fa fa-files-o' aria-hidden="true"></i>
              copy
            </button>
            { is_editable &&
            <button onClick={handleDelete}>
              <i className='fa fa-trash-o' aria-hidden="true"></i>
              delete
            </button>
            }
          </div>
          <ManifestPreview {...manifest} />
          <ToggleSwitch 
            id="view_mode_switch"
            caption="Show"
            onChange={ (view_mode) => this.setState({ view_mode }) }
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
