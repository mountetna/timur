// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import DocumentWindow from '../document/document_window';
import ListMenu from '../list_menu';
import ManifestScript from '../manifest/manifest_script';
import ConsignmentView from '../manifest/consignment_view';

import {
    requestManifests, selectManifest, requestConsignmentsByManifestId
} from '../../actions/manifest_actions';

import {
  requestPlots, selectPlot, saveNewPlot, savePlot, deletePlot
} from '../../actions/plot_actions';

import { getAllPlots, getSelectedPlot } from '../../selectors/plot_selector';
import { MD5, getLoadedConsignmentIds } from '../../selectors/consignment_selector';
import {
  isEmptyManifests, getEditableManifests
} from '../../selectors/manifest_selector';


// the basic plotter interface
//
// basics:
// plot name & buttons
// plot details
//
// script selection:
// edit view:
// import manifest script
// edit script
// view consignment
//
// layout
//  height
//  margin: top right left bottom
//
// series
//  + add
//  - remove
//  type
//  series vars, e.g. x y color

class Plotter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.props.requestManifests();
    this.props.requestPlots();
  }

  createPlot() {
    let date = new Date;
    let plot = {
      id: 0,
      access: 'private',
      name: '',
      script: '',
      configuration: {
        layout: {
          height: 0,
          width: 0
        },
        plot_series: []
      },
      created_at: date.toString(),
      updated_at: date.toString()
    };
    this.setState({plot, editing: true});
  }

  setPlot({plot}) {
    this.selectPlot(plot.id);
  }

  selectPlot(id) {
    if (!id) {
      this.setState({plot: null, md5sum: null});
      return;
    }

    let { plots } = this.props;

    let plot = plots.find(p=>p.id ==id);

    // copy it so you don't modify the store
    this.setState({
      plot: { ...plot },
      md5sum: MD5(plot.script)
    });
  }

  updateField(field_name){
    return (event)=>{
      let { plot, md5sum } = this.state;
      let new_md5sum;

      if (field_name == 'script') {
        // the code editor does not emit an event, just the new value
        plot.script = event;
        new_md5sum = MD5(plot.script);
      } else {
        plot[field_name] = event.target.value;
      }
      this.setState({plot, md5sum: new_md5sum || md5sum});
    }
  }

  savePlot() {
    let { plot, editing } = this.state;
    // A new plot should have an id set to 0.
    if(plot.id <= 0)
      this.props.saveNewPlot(plot,this.setPlot.bind(this));
    else
      this.props.savePlot(plot);

    if (editing) this.toggleEdit();
  }

  toggleEdit() {
    this.setState({
      editing: (!this.state.editing)
    });
  }

  copyPlot() {
    let { manifest } = this.state;
    this.props.copyManifest(manifest, this.setManifest.bind(this));
  }

  deletePlot(){
    let { plot } = this.state;
    if(confirm('Are you sure you want to remove this plot?')){
      this.props.deletePlot(plot, () => this.selectPlot(0));
    }
  }

  revertPlot() {
    let { plot: { id }, editing } = this.state;

    if (id > 0)
      this.selectPlot(id);
    else
      this.setState({plot: null});

    if (editing) this.toggleEdit();
  }

  render(){
    // Variables.
    let {
      plots,
      loaded_consignments
    } = this.props;

    let { plot, editing, md5sum } = this.state;


    return(
      <DocumentWindow
        editing={ editing }
        document={ plot }
        documents={ plots }
        documentType='plot'
        onUpdate={ this.updateField.bind(this) }
        onEdit={ this.toggleEdit.bind(this) }

        onCancel={ this.revertPlot.bind(this) }
        onSave={ this.savePlot.bind(this) }
        onCopy={ this.copyPlot.bind(this) }
        onRemove={ this.deletePlot.bind(this) } 

        onCreate={this.createPlot.bind(this)}
        onSelect={this.selectPlot.bind(this)} >
        <ManifestScript
          script={ plot && plot.script }
          is_editing={ editing }
          onChange={ this.updateField.bind(this)('script') }/>
      </DocumentWindow>
    );
  }
}

export default connect(
  (state = {}, own_props)=>{

    let plots = getAllPlots(state);
    return {
      plots,
      is_empty_manifests: isEmptyManifests(state),
      plotable_manifests: getEditableManifests(state),
      loaded_consignments: getLoadedConsignmentIds(state)
    };
  },
  {
    requestPlots,
    requestManifests,
    selectManifest,
    selectPlot,
    requestConsignmentsByManifestId,
    saveNewPlot,
    savePlot,
    deletePlot
  }
)(Plotter);
