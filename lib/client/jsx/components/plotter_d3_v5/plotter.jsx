// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';

import DocumentWindow from '../document/document_window';
import ListMenu from '../list_menu';
import Dropdown from '../dropdown';
import ManifestScript from '../manifest/manifest_script';
import ConsignmentView from '../manifest/consignment_view';
import PlotLayout from './plot_layout';
import PlotSeries from './plot_series';

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

const PLOTS = [
  {
    name: 'lineplot',
    series_types: [
      { name: 'line', variables: { x: 'expression', y: 'expression' } },
      { name: 'scatter', variables: { x: 'expression', y: 'expression' } }
    ]
  },
  {
    name: 'barpLot',
    series_types: [
      { name: 'line', variables: { x: 'expression', y: 'expression' } },
      { name: 'scatter', variables: { x: 'expression', y: 'expression' } }

    ]
  },
  {
    name: 'heatplot',
    series_types: [
      { name: 'line', variables: { x: 'expression', y: 'expression' } },
      { name: 'scatter', variables: { x: 'expression', y: 'expression' } }

    ]
  }
];
class Plotter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      selected_plot_index: null,
      active_selected_plot_series_index: null,
      plot: null
    };

    this.onSelectPlot = this.onSelectPlot.bind(this);
    this.onSelectPlotSeries = this.onSelectPlotSeries.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onAddSeries = this.onAddSeries.bind(this);
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
      name: null,
      script: '',
      configuration: {
        layout: {
          height: 0,
          width: 0
        },
        plot_series: [],
        plot_type: ''
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

  deletePlot() {
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
  
  onSelectPlot(index) {    
    this.setState({
      selected_plot_index: index
    });
  }



  onSelectPlotSeries(index) {
    this.setState({
      active_selected_plot_series_index: index
    });
  }

  onReset(){
    this.setState({
      selected_plot_index: null,
      active_selected_plot_series_index: null
    });
  }

  onAddSeries() {
    return <PlotSeries />;
  }
  
  render(){
    // Variables.
    let {
      plots,
      loaded_consignments
    } = this.props;

    let { plot, editing, md5sum, selected_plot_index } = this.state;
  
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
        Manifest:
        <ManifestScript
          script={ plot && plot.script }
          is_editing={ editing }
          onChange={ this.updateField.bind(this)('script') }/>
        Layout:
        <PlotLayout/>
        Series:
        <span> + add series </span>
        {selected_plot_index != null ? 
          
          <div className='dd-wrapper'>
            <div className='dd-header'>
              <div className='dd-header-text'>
                {PLOTS[selected_plot_index].name}
              </div>
              <FontAwesome onClick={this.onReset} name='times'/>
            </div> 
            <div>
              <Dropdown 
                default_text = "Select Plot Series"
                list = {PLOTS[selected_plot_index].series_types.map(series=> series.name)}
                onSelect = {this.onSelectPlotSeries}
                selected_index = {this.state.active_selected_plot_series_index}
              />
              <div className="dd-header">
                <label className="dd-header-text"> x:</label>
                <div className="dd-header-text">
                  <input
                    className="input"
                    type="text"
                    name="xexpression"
                    value="test"
                  />
                </div>
              </div>

              <div className="dd-header">
              <label className="dd-header-text"> y:</label>
              <div className="dd-header-text">
                <input
                  className="input"
                  type="text"
                  name="xexpression"
                  value="test"
                />
              </div>
            </div>
            <button>Add Series</button>

            
              <form>
              
              </form>
          
            </div>

          </div>
        
          :
          <Dropdown 
            default_text = 'Select Plot'
            list={PLOTS.map(plot => plot.name)}
            onSelect={this.onSelectPlot}
            selected_index = {selected_plot_index}
          />
        }

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
