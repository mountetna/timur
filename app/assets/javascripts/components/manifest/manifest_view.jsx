import { connect } from 'react-redux';

import React, { Component } from 'react';
import ManifestElement from './manifest_element';
import ManifestPreview from './manifest_preview';
import ButtonBar from '../button_bar';
import ToggleSwitch from '../toggle_switch';
import { selectConsignment } from '../../selectors/consignment';
import { requestConsignments, manifestToReqPayload, deleteManifest, toggleEdit, copyManifest } from '../../actions/manifest_actions';
import { getPlotsByIds } from '../../selectors/plot';
import { selectPlot, toggleEditing as plotEdit } from '../../actions/plot_actions';
import { plotIndexUrl } from '../../api/plots';

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
    const { manifest, consignment, deleteManifest, toggleEdit, copyManifest, requestConsignments } = this.props
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

    let buttons = [
      is_editable && {
        click: toggleEdit,
        icon: 'pencil-square-o',
        label: 'edit'
      },

      this.state.view_mode == 'output' && is_editable && {
        click: () => location.href = plotIndexUrl({ manifest_id: manifest.id, is_editing: true }),
        icon: 'line-chart',
        label: 'plot'
      },

      {
        click: () => copyManifest(manifest),
        icon: 'files-o',
        label: 'copy'
      },

      is_editable && {
        click: () => deleteManifest(manifest.id),
        icon: 'trash-o',
        label: 'delete'
      }
    ].filter(_=>_)

    return (
      <div className='manifest'>
        <div className='manifest-elements'>
          <ButtonBar className='actions' buttons={ buttons }/>
          <ManifestPreview {...manifest} />
          <ToggleSwitch 
            id="view_mode_switch"
            caption="Show"
            onChange={ (view_mode) => {
              this.setState({ view_mode })
              if (view_mode == 'output' && !consignment) {
                if (!consignment) requestConsignments([manifestToReqPayload(manifest)])
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
                    <a href={plotIndexUrl({ manifest_id: manifest.id, id: plot.id })}>
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
  (state, props) => ({
    consignment: selectConsignment(state, props.manifest.name),
    plots: getPlotsByIds(state, props.manifest.plotIds || [])
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
