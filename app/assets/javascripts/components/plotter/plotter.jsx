// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ListMenu from '../list_menu';
import {PlotViewContainer as PlotView} from './plot_view';

// Module imports.
import * as ManifestActions from '../../actions/manifest_actions';
import * as PlotActions from '../../actions/plot_actions';

import * as PlotSelector from '../../selectors/plot_selector';
import * as ConsignmentSelector from '../../selectors/consignment';
import * as ManifestSelector from '../../selectors/manifest_selector';

export class Plotter extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    // Request manifests during initial page load, if there are none loaded.
    if(this.props.is_empty_manifests) this.props.requestManifests();
  }

  newPlot(){
    this.props.selectPlot(0);
  }

  selectPlot(plot_id){
    let plot = this.props.all_plots.find(p => p.id == plot_id);

    /*
     * We need to make a check for the consignment in the store. Presently, the
     * plot does not check the store to see if a consignment has already been
     * downloaded.
     */
    this.props.requestConsignmentsByManifestId([plot.manifest_id], null);
    this.props.selectManifest(plot.manifest_id);
    this.props.selectPlot(plot.id);

    /*
     * Since the PlotView rely's upon it's state object we need to also force a
     * rerender to update the view with the selected plot.
     */
    this.forceUpdate();
  }

  deletePlot(){
    this.props.deletePlot(this.props.selected_plot);
  }

  render(){

    // Variables.
    let {
      all_plots,
      plot_types,
      is_editing,
      selected_plot,
      plotable_manifests,
      loaded_consignments
    } = this.props;

    // Functions.
    let {
      selectManifest,
      saveNewPlot,
      savePlot
    } = this.props;

    let list_menu_props = {
      name: 'Plot',
      create: this.newPlot.bind(this),
      select: this.selectPlot.bind(this),
      items: all_plots
    };

    let plot_view_props = {
      plotable_manifests,
      plot_types,
      loaded_consignments,
      selected_plot,
      selectManifest,
      savePlot,
      saveNewPlot,
      handleDelete: this.deletePlot.bind(this)
    };

    return(
      <div className='plotter-group'>

        <div className='left-column-group'>

          <ListMenu {...list_menu_props} />
        </div>
        <div className='right-column-group'>

          {(selected_plot || is_editing) ? <PlotView {...plot_view_props} /> : ''}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{

  // The types of plots offered is a static value. We need to externalize this.
  let plot_types = ['scatter', 'heatmap'];

  return {
    plot_types,
    selected_plot: PlotSelector.getSelectedPlot(state),
    all_plots: PlotSelector.getAllPlots(state),
    is_editing: state.plots.isEditing,
    is_empty_manifests: ManifestSelector.isEmptyManifests(state),
    plotable_manifests: ManifestSelector.getEditableManifests(state),
    loaded_consignments: ConsignmentSelector.getLoadedConsignmentIds(state)
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestManifests: ()=>{
      dispatch(ManifestActions.requestManifests());
    },

    selectManifest: (manifest_id)=>{
      dispatch(ManifestActions.selectManifest(manifest_id));
    },

    selectPlot: (plot_id)=>{
      dispatch(PlotActions.selectPlot(plot_id));
    },

    /*
     * Here the record name is null, but you could supply the @record_name
     * variable if you wished.
     */
    requestConsignmentsByManifestId: (manifest_ids, record_name)=>{
      dispatch(ManifestActions.requestConsignmentsByManifestId(manifest_ids, record_name));
    },

    saveNewPlot: (plot)=>{
      dispatch(PlotActions.saveNewPlot(plot));
    },

    savePlot: (plot)=>{
      dispatch(PlotActions.savePlot(plot));
    },

    deletePlot: (plot)=>{
      dispatch(PlotActions.deletePlot(plot));
    }
  };
};

export const PlotterContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(Plotter);
