// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import BoxGraph from '../../plotter_d3_v5/plots/box_plot/box_graph';
import Resize from '../../plotter_d3_v5/resize';
import Consignment from '../../../models/consignment';

// Module imports.
import * as ManifestActions from '../../../actions/manifest_actions';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';

export class BoxPlotAttribute extends GenericPlotAttribute{
  render(){
    if(this.props.selected_plot == undefined) return null;
    let {selected_plot, groups} = this.props;

    let box_plot_props = {
      plot: {
        height: selected_plot.layout.height + 200,
        width: selected_plot.layout.width,
        y_min_max: [0, 1],
        margins: {top: 40, right: 50, bottom: 100, left: 60},
        color_range: ['#cbf2bb', '#46a21f']
      },
      groups
    };

    return(
      <div className='value'>

        <Resize render={width => (
          <BoxGraph {...box_plot_props} parent_width={width} />
        )}/>
      </div>
    );
  }
}
let quantile = (values, p) => {
  if ( p == 0.0 ) { return values[ 0 ] }
  if ( p == 1.0 ) { return values[ values.length-1 ] }
  var id = values.length*p- 1
  if ( id == Math.floor( id ) ) {
    return ( values[ id ] + values[ id+1 ] ) / 2.0
  }
  id = Math.ceil( id )
  return values[ id ]
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

    groups = group_names.map((group_name, index)=>{

      let null_counter = 0;
      let heights = category.which((value)=>{
        return (value == group_name);
      });

      heights = heights.filter((value)=>{
        return (value != null);
      });

      let values = height(heights);
      values = values.sort(function(a,b) { return a-b })

      let quartile_data = [
        quantile(values, 0.25),
        quantile(values, 0.5),
        quantile(values, 0.75)
      ]

      let iqr = (quartile_data[2] - quartile_data[0]) * 1.5;
      
      let whisker_min = values.find(value => {
        if(value === null) null_counter++;
        return value >= quartile_data[0] - iqr && value !== null;
      });

      let whisker_max = values.reverse().find(value => {
        return value <= quartile_data[2] + iqr;
      });

      let outliers = values.filter(value => {
        return (value < whisker_min  || value > whisker_max) && value !== null;
      });

      return {
        label: group_name,
        values: height(heights),
        inliers: {whisker_min, whisker_max, quartile_data},
        outliers,
        null_counter
      }
    });

    /*
    quantiles: group_names.map(group => ({
      whisker_min, whisker_max, median, group_name
    }))
    values: height.map((label,value) => ({
      value, ca, label
    }))
  }
*/
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
