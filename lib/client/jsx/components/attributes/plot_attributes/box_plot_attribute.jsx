// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import BoxPlot from '../../plotter/plots/box_plot';
import Consignment from '../../../models/consignment';

// Module imports.
import * as ManifestActions from '../../../actions/manifest_actions';
import * as Colors from '../../../utils/colors';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';

export class BoxPlotAttribute extends GenericPlotAttribute{
  render(){
    if(this.props.selected_plot == undefined) return null;

    let box_plot_props = {
      ymin: 0,
      ymax: 1,
      plot: this.props.selected_plot.layout,
      groups: this.props.groups
    };

    return(
      <div className='value'>

        <BoxPlot {...box_plot_props} />
      </div>
    );
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  /*
   * Pull the data required for this plot.
   */
  let selected_plot, selected_manifest, selected_consignment = undefined;
  
  selected_plot = state.plots.plotsMap[own_props.attribute.plot_id];
  if(selected_plot != undefined){
    selected_manifest = state.manifests[selected_plot.manifest_id];
  }
  if(selected_manifest != undefined){
    selected_consignment = ConsignmentSelector.selectConsignment(
      state,
      selected_manifest.md5sum
    );
  }

  /*
   * Process the data required for this plot.
   */
  let groups = [];
  if(selected_consignment){
    let height = selected_consignment.height;
    let category = selected_consignment.category;
    let group_names = [...new Set(category.values)];
    let colors = Colors.autoColors(group_names.length);

    groups = group_names.map((group_name, index)=>{

      let heights = category.which((value)=>{
        return (value == group_name);
      });

      heights = heights.filter((value)=>{
        return (value != null);
      });

      return {
        name: group_name,
        color: colors[index],
        values: height(heights)
      }
    });
  }

  /*
   * Set the data required for this plot.
   */
  return {
    groups,
    selected_plot,
    selected_manifest,
    selected_consignment
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    initialized: (component)=>{
      dispatch({
        type: 'INITIALIZED',
        component
      });
    },

    fetchConsignment: (manifest_id, record_name)=>{
      dispatch(ManifestActions.requestConsignmentsByManifestId(
        [manifest_id],
        record_name
      ));
    }
  };
};

export const BoxPlotAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(BoxPlotAttribute);
