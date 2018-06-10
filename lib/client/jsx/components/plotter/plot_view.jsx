// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ButtonBar from '../button_bar';
import {ScatterPlotContainer as ScatterPlot} from './plots/scatter_plot';
import HeatMapPlot from './plots/heat_map_plot';
import {GenericPlotForm} from './forms/generic_plot_form';

// Module imports.
import {scatterPlotFormData} from './forms/scatter_plot_form_data';
import {heatMapFormData} from './forms/heat_map_form_data';

import * as ManifestActions from '../../actions/manifest_actions';
import * as PlotSelector from '../../selectors/plot_selector';
import * as ConsignmentSelector from '../../selectors/consignment_selector';
import * as ManifestSelector from '../../selectors/manifest_selector';

export class PlotView extends React.Component{
  constructor(props){
    super(props);

    if(props.selected_plot){
      this.state = {
        selected_plot: this.clonePlot(props.selected_plot),
        selected_manifest: props.selected_manifest,

        // If we have a new plot (id == 0), then we turn on editing.
        is_editing: (props.selected_plot.id == 0) ? true : false
      }
    }
    else{
      this.state = {
        selected_plot: {},
        selected_manifest: {},
        is_editing: false
      }
    }
  }

  /*
   * When a new plot is selected it is set on the 'props'. However, to redraw
   * the new plot we then need to map it to the 'state'.
   */
  componentDidUpdate(){
    let {selected_plot} = this.props;

    /*
     * If the plot doesn't exist or if the current plot prop equals the current 
     * plot state, then bail. This check MUST happen or else you get a state
     * update loop.
     */
    if(
      !selected_plot ||
      (selected_plot.id == this.state.selected_plot.id)
    ){
      return;
    }

    this.setState({
      selected_manifest: this.props.selected_manifest,
      selected_plot: this.clonePlot(this.props.selected_plot),

      // If we have a new plot (id == 0), then we turn on editing.
      is_editing: (selected_plot.id == 0) ? true : false
    });
  }

  clonePlot(selected_plot){
    return JSON.parse(JSON.stringify(selected_plot));
  }

  toggleEdit(){
    this.setState({
      is_editing: (!this.state.is_editing)
    });
  }

  savePlot(){
    let {selected_plot} = this.state;
    if(selected_plot.id > 0) this.props.savePlot(selected_plot);

    if(selected_plot.id == 0){

      // Check that there is minimum data.
      if(
        selected_plot.manifest_id == null ||
        selected_plot.name == null ||
        selected_plot.name == '' ||
        selected_plot.plot_type == null ||
        selected_plot.plot_type == ''
      ){
        alert('You must enter a name, select a manifest, and select a plot');
        return;
      }

      // The '0' id must be removed before a a new plot can be created.
      delete selected_plot.id;
      this.props.saveNewPlot(selected_plot);
    }
  }

  // If the consigment for the manifest isn't in the store then fetch it.
  fetchConsignment(manifest_id){
    if(this.props.loaded_consignments.indexOf(manifest_id) <= 0){
      this.props.requestConsignmentsByManifestId(
        [manifest_id],
        null
      );
    }
  }

  cancelEdit(){

    // Turn off the editing mode.
    this.toggleEdit();

    // If this is a new plot (id == 0) then reset the page with a null id.
    if(this.props.selected_plot.id == 0){
      this.props.selectPlot(null);
      return;
    }

    // Reset the plot.
    let selected_plot = this.clonePlot(this.props.selected_plot);
    this.setState({selected_plot});

    /*
     * Set the manifest selected in the store. This will refresh the consignment
     * selection in the container without rebuilding the state.
     */
    this.props.selectManifest(selected_plot.manifest_id);

    // If the consigment for the manifest isn't in the store then fetch it.
    this.fetchConsignment(selected_plot.manifest_id);
  }

  /*
   * The key/value data we are interested in is in a nested object. We need to
   * traverse the object. We have a array 'evt.target.dataset.field' with the
   * keys that lead down to the value of interest. We must loop the key array
   * and extract the object of interest before updating it.
   */
  updateField(event){
    let {selected_plot} = this.state;
    let fields = event.target.dataset.field.split('.');
    let field = selected_plot;

    // Loop the key array to get the object we want to change.
    for(let a = 0; a < (fields.length - 1); ++a){
      field = field[fields[a]];
    }

    // Change the object.
    field[fields[fields.length - 1]] = event.target.value;

    // Set the change on the state plot object.
    this.setState({selected_plot});
  }

  updateManifest(event){
    let {selected_plot} = this.state;
    let {plotable_manifests, loaded_consignments} = this.props;

    // Set the new manifest id.
    selected_plot.manifest_id = event.target.value;

    // Clear the associated plot infomation.
    selected_plot.plot_type = null;
    selected_plot = this.clearPlot(selected_plot);

    /*
     * Extract the chosen manifest from the plot-able manfiests and elect the
     * first element.
     */
    let selected_manifest = plotable_manifests.filter((manifest)=>{
      return manifest.id == selected_plot.manifest_id;
    })[0]

    // Set the change on the state plot and manifest objects.
    this.setState({selected_plot, selected_manifest});

    /*
     * Set the manifest selected in the store. This will refresh the consignment
     * selection in the container without rebuilding the state.
     */
    this.props.selectManifest(selected_plot.manifest_id);

    // If the consigment for the manifest isn't in the store then fetch it.
    this.fetchConsignment(selected_plot.manifest_id);
  }

  updateSelectedPlot(event){
    let {selected_plot} = this.state;
    selected_plot.plot_type = event.target.value;

    // Clear out the plot data and layout information.
    selected_plot = this.clearPlot(selected_plot);

    // Set the change on the state plot object.
    this.setState({selected_plot});
  }

  clearPlot(selected_plot){

    // Clear the plot data.
    selected_plot.data = [];

    /*
     * Remove everything from the layout that isn't 'title', 'width', and
     * 'height'.
     */
    Object.keys(selected_plot.layout).forEach((key, index)=>{
      let keep = ['title', 'width', 'height'];
      if(keep.indexOf(key) == -1) delete selected_plot.layout[key];
    });

    // Set a blank layout from the plot specific form data.
    switch(selected_plot.plot_type){
      case 'scatter':
        Object.assign(
          selected_plot.layout,
          scatterPlotFormData(null).form_headers
        );
        break;
      case 'heatmap':
        Object.assign(
          selected_plot.layout,
          heatMapFormData(null).form_headers
        );
        break;
      default:
        selected_plot.layout.width = selected_plot.layout.height = null;
        break;
    }

    return selected_plot;
  }

  // This is a handler for data that applies to a specific type of plot.
  addSeries(series_object){
    let {selected_plot} = this.state;
    selected_plot.data.push(series_object);
    this.setState({selected_plot});
  }

  // This is a handler for data that applies to a specific type of plot.
  updateSeries(series_index, series_field, series_value){
    let {selected_plot} = this.state;
    selected_plot.data[series_index][series_field] = series_value;
    this.setState({selected_plot});
  }

  // This is a handler for data that applies to a specific type of plot.
  removeSeries(series_index){
    let {selected_plot} = this.state;
    selected_plot.data.splice(series_index, 1);
    this.setState({selected_plot});
  }

  editableButtons(){

    let {handleDelete} = this.props;
    return [
      {
        click: (selected_plot)=>{
          if(confirm('Are you sure you want to remove this plot?')){
            this.props.handleDelete(selected_plot);
          }
        },
        icon: 'far fa-trash-alt',
        label: ' DELETE'
      },
      {
        click: this.toggleEdit.bind(this),
        icon: 'far fa-edit',
        label: ' EDIT'
      }
    ].filter(button=>button);
  }

  editingButtons(){
    return [
      {
        click: this.savePlot.bind(this),
        icon: 'far fa-save',
        label: ' SAVE'
      },
      {
        click: this.cancelEdit.bind(this),
        icon: 'fas fa-ban',
        label: ' CANCEL'
      }
    ].filter(button=>button);
  }

  renderManifestSelection(){
    let {selected_plot} = this.state;

    // Only allow manifest selection if the selected plot is new (id == 0).
    let disabled = (selected_plot.id > 0) ? 'disabled' : '';

    let selector_props = {
      className: 'disabled plotter-selector',
      onChange: this.updateManifest.bind(this),
      disabled
    };

    return(
      <div className='potter-manifest-select-group'>

        {'Manifest Select : '}
        <select {...selector_props} data-field='manifest_id'>

          {(selected_plot.manifest_id == null) ? <option disabled selected value>{'--'}</option> : null}

          {this.props.plotable_manifests.map((manifest, index)=>{

            let opt_props = {key: `manifest-${index}`, value: manifest.id};
            if(manifest.id == selected_plot.manifest_id){
              return <option {...opt_props} selected>{manifest.name}</option>;
            }
            else{
              return <option {...opt_props}>{manifest.name}</option>;
            }
          })}

        </select>
      </div>
    );
  }

  renderPlotSelection(){
    let {selected_plot, is_editing} = this.state;
    if (!is_editing) return null;
    let disabled = (!this.state.is_editing) ? 'disabled' : '';
    let selector_props = {
      className: 'disabled plotter-selector',
      onChange: this.updateSelectedPlot.bind(this),
      disabled: disabled
    };

    return(
      <div className='potter-manifest-select-group'>

        {'Plot Select : '}
        <select {...selector_props} data-field='plot_type'>

          {(selected_plot.plot_type == null) ? <option disabled selected value>{'--'}</option> : null}

          {this.props.plot_types.map((type, index)=>{

            let opt_props = {key: `plot-${index}`, value: type};
            if(selected_plot.plot_type == type){
              return <option {...opt_props} selected>{type}</option>;
            }
            else{
              return <option {...opt_props}>{type}</option>;
            }
          })}

        </select>
      </div>
    );
  }

  renderPlotSpecificForm(){
    let {selected_plot, selected_manifest, is_editing} = this.state;

    if (!is_editing) return null;
    // This happens if a manifest has not been selected.
    if(selected_manifest == undefined) return null;

    let form_props = {
      selected_manifest,
      is_editing,
      plot: selected_plot,
      updateField: this.updateField.bind(this),
      addSeries: this.addSeries.bind(this),
      updateSeries: this.updateSeries.bind(this),
      removeSeries: this.removeSeries.bind(this)
    };

    /*
     * These are the variables, from the manifest, that can be mapped to the X
     * and Y axises.
     */
    let series_options = selected_manifest.data.elements.map((elem)=>{
      return elem.name;
    });

    switch(selected_plot.plot_type){
      case 'scatter':
        form_props['form_data'] = scatterPlotFormData(series_options);
        break;
      case 'heatmap':
        form_props['form_data'] = heatMapFormData(series_options);
        break;
      default:
        form_props['form_data'] = null;
        break;
    }

    if(form_props['form_data'] != null){
      return <GenericPlotForm {...form_props} />;
    }
    else{
      return null;
    }
  }

  renderPlot(){
    let {selected_plot} = this.state;
    let {selected_consignment} = this.props;
    let plot_props = {
      plot: selected_plot,
      consignment: selected_consignment
    };

    switch(selected_plot.plot_type){
      case 'scatter':
        return <ScatterPlot {...plot_props} />;
      case 'heatmap':
        return <HeatMapPlot {...plot_props} />;
      default:
        return null;
    }
  }

  renderPlotDetails() {
    let {selected_plot, is_editing} = this.state;
    if (!is_editing) return null;
    let input_props = {
      className: `plotter-form-title-input`,
      type: 'text',
      onChange: this.updateField.bind(this)
    };

    return <div className='plotter-form-details'>
      {this.renderManifestSelection()}
      {this.renderPlotSelection()}
      {'Height: '}
      <input {...input_props} value={selected_plot.layout.height} data-field='layout.height' />
      <br />
      {'Width: '}
      <input {...input_props} value={selected_plot.layout.width} data-field='layout.width'/>
    </div>;
  }

  render(){
    let {selected_plot, is_editing} = this.state;
    let disabled = (!is_editing) ? 'disabled' : '';

    let input_props = {
      className: `${disabled} plotter-form-title-input`,
      type: 'text',
      onChange: this.updateField.bind(this),
      disabled
    };

    let buttons;
    if(is_editing){
      buttons = this.editingButtons();
    }
    else{
      buttons = this.editableButtons();
    }

    return(
      <div className='plotter-view-group'>

        <div className='plotter-form-group'>

          <div className='plotter-form-header'>

            <div className='plotter-form-title'>

              {'Name: '}
              <input {...input_props} value={selected_plot.name} data-field='name' />
              <ButtonBar className='plotter-action-btn-group' buttons={buttons} />
              <span style={{float: 'right'}}>

                {(is_editing) ? 'EDIT MODE' : ''}
              </span>
            </div>
            <br />
            {this.renderPlotDetails()}
            {this.renderPlotSpecificForm()}
          </div>
        </div>
        <div className='plotter-plot-group'>

          {this.renderPlot()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  let selected_manifest = state.manifests[state.manifestsUI.selected];
  let selected_consignment = null;

  if(selected_manifest){
    selected_consignment = ConsignmentSelector.selectConsignment(
      state,
      selected_manifest.md5sum
    );
  }

  return {
    selected_consignment,
    selected_manifest,
    selected_plot: own_props.selected_plot
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    /*
     * Here the record name is null, but you could supply the @record_name
     * variable if you wished.
     */
    requestConsignmentsByManifestId: (manifest_ids, record_name)=>{
      dispatch(ManifestActions.requestConsignmentsByManifestId(manifest_ids, record_name));
    },
  };
};

export const PlotViewContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(PlotView);
