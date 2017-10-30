// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ManifestElement from './manifest_element';
import ManifestPreview from './manifest_preview';
import ButtonBar from '../button_bar';

// Module imports.
import {manifestToReqPayload, deleteManifest, toggleEdit, copyManifest} from '../../actions/manifest_actions';
import {requestConsignments} from '../../actions/consignment_actions';
import {selectConsignment} from '../../selectors/consignment';
import {getPlotsByIds} from '../../selectors/plot';
import {plotIndexUrl} from '../../api/plots';

export class ManifestView extends React.Component{
  constructor(props){
    super(props);
    this.state = {view_mode: 'script'};
  }

  renderButtonBar(){

    let {manifest, toggleEdit, deleteManifest, copyManifest} = this.props;
    let {is_editable} = manifest;

    let buttons = [
      {
        click: ()=>copyManifest(manifest),
        icon: 'files-o',
        label: 'copy'
      },
      is_editable && {
        click: toggleEdit,
        icon: 'pencil-square-o',
        label: 'edit'
      },
      is_editable && {
        click: ()=>deleteManifest(manifest.id),
        icon: 'trash-o',
        label: 'delete'
      },
      is_editable && this.state.view_mode == 'output' && {
        click: ()=>{
          location.href = plotIndexUrl({
            manifest_id: manifest.id,
            is_editing: true
          });
        },
        icon: 'line-chart',
        label: 'plot'
      }
    ].filter(button=>button);

    return <ButtonBar className='actions' buttons={buttons} />
  }

  renderToggleSwitch(){
    let {manifest, consignment, requestConsignments} = this.props;
    let query_btn_props = {
      className: 'manifest-query-button',
      onClick: (evt)=>{
        this.setState({view_mode: 'output'});
        if(!consignment) requestConsignments([manifestToReqPayload(manifest)]);
      },
      disabled: (this.state.view_mode == 'output') ? 'disabled' : ''
    };

    let script_btn_props = {
      className: 'manifest-query-button',
      onClick: (evt)=>{
        this.setState({view_mode: 'script'});
      },
      disabled: (this.state.view_mode == 'script') ? 'disabled' : ''
    };

    return(
      <span>

        <button {...query_btn_props}>

          {'Run Query'}
        </button>
        <button {...script_btn_props}>

          {'Show Script'}
        </button>
      </span>
    );
  }

  renderManifestElements(){
    let {manifest, consignment} = this.props;

    let manifest_elements = manifest.data.elements || [];
    manifest_elements = manifest_elements.map((element, index)=>{

      let element_result = '';
      if(consignment && consignment[element.name]){
        element_result = consignment[element.name];
      }

      let props = {
        ...element,
        result: element_result,
        view_mode: this.state.view_mode
      };

      return(
        <li key={index}>

          <ManifestElement {...props} />
        </li>
      );
    });

    return <ol>{manifest_elements}</ol>;
  }

  renderPlots(){
    if(this.state.view_mode != 'output') return null;

    let {manifest} = this.props;
    let plots = this.props.plots.map((plot, index)=>{
      return(
        <li key={plot.id}>

          <a href={plotIndexUrl({manifest_id: manifest.id, id: plot.id})}>

            {plot.name}
          </a>
        </li>
      );
    });

    return(
      <div>

        <div>{'Plots: '}</div>
        <ul>{plots}</ul>
      </div>
    );
  }

  render(){
    return(
      <div className='manifest'>

        <div className='manifest-elements'>

          {this.renderButtonBar()}
          <ManifestPreview {...this.props.manifest} />
          {this.renderToggleSwitch()}
          {this.renderManifestElements()}
          {this.renderPlots()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  return {
    consignment: selectConsignment(state, own_props.manifest.name),
    plots: getPlotsByIds(state, own_props.manifest.plotIds || [])
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    copyManifest: (manifest_record)=>{
      dispatch(copyManifest(manifest_record));
    },
    deleteManifest: (manifest_id)=>{
      dispatch(deleteManifest(manifest_id));
    },
    toggleEdit: (manifest_action)=>{
      dispatch(toggleEdit(manifest_action));
    },
    requestConsignments: (manifests)=>{
      dispatch(requestConsignments(manifests));
    }
  };
};

export default ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ManifestView);
