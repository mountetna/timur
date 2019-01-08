// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import DocumentWindow from '../document/document_window';
import ListMenu from '../list_menu';
import Dropdown from '../dropdown';
import ManifestScript from '../manifest/manifest_script';
import ConsignmentView from '../manifest/consignment_view';
import PlotLayout from './plot_layout';
import PlotSeries from './plot_series';
import Plot from './plot';

import {
    requestManifests, selectManifest, requestConsignmentsByManifestId
} from '../../actions/manifest_actions';

import {
  requestPlots, selectPlot, saveNewPlot, savePlot, deletePlot
} from '../../actions/plot_actions';

import { getAllPlots, getSelectedPlot, plotWithScript } from '../../selectors/plot_selector';
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
    label: 'Line Plot',
    series_types: [
      { type: 'line', variables: { x: 'expression', y: 'expression', color: 'color_type'} },
      { type: 'scatter', variables: { x: 'expression', y: 'expression', color: 'color_type'} }
    ]
  },
  {
    name: 'barplot',
    series_types: [
      { type: 'bar', variables: { height: 'expression', category: 'expression' } }
    ]
  }
];
class Plotter extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      selected_plot_index: null,
      selected_plot_series_index: null,
      plot: null,
      unsaved_plots: {},
      new_plot_series_counter: 0
    };
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
          margin: {top: 10, bottom: 10, left: 10, right: 10}
        },
        plot_series: [],
        plot_type: null
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

    let {plots} = this.props;

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
    };
  }

  updatePlotField(field_name){
    return (value)=>{
      let { plot } = this.state;
      plot[field_name] = value;
      this.setState({plot});
    };
  }

  updatePlotConfiguration(field_name){
    return (value)=>{
      let { plot } = this.state;
      let new_configuration = {...plot.configuration, [field_name]: value};
      this.updatePlotField('configuration')(new_configuration);
    };
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

  renderEditor() {
    let {plot} = this.state;
    let plot_config = PLOTS.find(pc => pc.name == plot.plot_type);
 
    return(<div>
    Manifest
    <ManifestScript
      script={ plot.script }
      is_editing={ true }
      onChange={ this.updateField.bind(this)('script') }/>
    Layout
    <hr />
    <PlotLayout 
      layout={ plot.configuration.layout }
      onChange={
        this.updatePlotConfiguration('layout')
      }
    />

    Plot Type
    <hr />
    <br/>
    { plot.plot_type != null ? 
      <div className='wrapper'>
        <div className='dd-wrapper left'>
          <div className='dd-header-title-text'>
            {plot.plot_type}
          </div> 

          {plot.plot_type &&
            <div>
              <Dropdown 
                  default_text="Add Series"
                  list={plot_config.series_types.map(series=> series.type)}
                  onSelect={(index) => {
                    let new_series = {series_type: plot_config.series_types[index].type, variables: {}, label: null};
                    this.updatePlotConfiguration('plot_series')(
                      [new_series, ...plot.configuration.plot_series],
                    );
                  }}
                  selected_index={null}
                />
            </div>
          }
          </div>
          <div className='dd-wrapper right'>
            <div>
              <i onClick={() => {
                  this.updatePlotField('plot_type')(null);
                  this.updatePlotConfiguration('plot_series')([]);
                }}
                className='right fa fa-lg'>&times;
              </i>
            </div>
          </div>
      </div>
    
      :
      <Dropdown 
        default_text = 'Select Plot'
        list={PLOTS.map(plot_config => plot_config.name)}
        onSelect={(index) => {this.updatePlotField('plot_type')(PLOTS[index].name);}}
        selected_index = {PLOTS.indexOf(plot_config)}
      />
    } 



    { plot.configuration.plot_series.map((series, index)=>
      <PlotSeries 
          key={`ps-container-${index}`}  
          plot_series={series} 
          series_config={plot_config.series_types.find(s=>s.type==series.series_type)}
          onDelete= {()=>{
            let new_plot_series = plot.configuration.plot_series.slice(0);
            new_plot_series.splice(index, 1);
            this.updatePlotConfiguration('plot_series')(new_plot_series);
          }}
          onChange={(name, value) => { 
            let new_plot_series = plot.configuration.plot_series.slice(0);
            new_plot_series[index] = {...series, [name]: value};
            this.updatePlotConfiguration('plot_series')(new_plot_series);
      }}/>)
    }
    </div>);

  }

  renderPlot() {
    let {plot} = this.state;

    return(
      <div className='chart'>
        <Resize render={width => (
          <Plot plot={plotWithScript([plot, {}])} width={width}/>
        )}/>
      </div>
    );

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
        {editing ? this.renderEditor() : this.renderPlot()}

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
