// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import LinePlot from '../../plotter/plots/line_plot';
import Consignment from '../../../models/consignment';

// Module imports.
import * as ManifestActions from '../../../actions/manifest_actions';
import * as Colors from '../../../utils/colors';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';

export class LinePlotAttribute extends GenericPlotAttribute{
  render(){
    if(this.props.selected_plot == undefined) return null;

    let line_plot_props = {
      ylabel: 'sample count',
      xlabel: '',
      plot: this.props.selected_plot.layout,
      lines: this.props.lines
    };

    return(
      <div className='value'>

        <LinePlot {...line_plot_props} />
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
  let lines = [];
  if(selected_consignment && selected_consignment.lines){
    let colors = Colors.autoColors(selected_consignment.lines.size);

    lines = selected_consignment.lines.map((label, line, index_a)=>{

      let points = line('x').map((identifier, x_val, index_b)=>{
        return {
          label: identifier,
          x: x_val,
          y: line('y')(index_b)
        }
      });

      points = points.filter((point)=>{
        return (point.x != null && point.y != null);
      }); 

      return {
        label,
        points,
        color: colors[index_a]
      };
    });
  }

  /*
   * Set the data required for this plot.
   */
  return {
    lines,
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

export const LinePlotAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(LinePlotAttribute);
