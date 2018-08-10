 // Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import LineGraph from '../../plotter_d3_v5/plots/line_plot/line_graph';
import Resize from '../../plotter_d3_v5/resize';
import Consignment from '../../../models/consignment';

// Module imports.
import * as ManifestActions from '../../../actions/manifest_actions';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';

export class LinePlotAttribute extends GenericPlotAttribute{
  render(){
    let {selected_plot, lines, x_min_max,  y_min_max} = this.props;
    if(selected_plot == undefined) return null;
 
    selected_plot.layout.height = 400;

    let line_plot_props = {
      plot: {
        height: selected_plot.layout.height,
        width: selected_plot.layout.width,
        x_min_max,
        y_min_max,
        margins: {top: 40, right: 50, bottom: 100, left: 60}
      },
      lines
    };

    return(
      <div className='value'>
  
        <Resize render={width => (
          <LineGraph {...line_plot_props} parent_width={width} />
        )}/>
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
        points
      };
    });
  }

  let x_values = lines.reduce(
    (values, line) => values.concat(line.points.map((point) => point.x )),
    []
  )

  let y_values = lines.reduce(
    (values, line) => values.concat(line.points.map((point) => point.y )),
    []
  )

  let x_min = Math.min(...x_values);
  let x_max = Math.max(...x_values);
  let y_min = Math.min(...y_values);
  let y_max = Math.max(...y_values);

  /*
   * Set the data required for this plot.
   */
  return {
    lines,
    x_min_max: [x_min, x_max],
    y_min_max: [y_min, y_max],
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
