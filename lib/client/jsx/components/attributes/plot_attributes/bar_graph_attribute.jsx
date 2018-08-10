// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import BarGraph from '../../plotter_d3_v5/plots/bar_plot/bar_graph';
import Resize from '../../plotter_d3_v5/resize';
import Consignment from '../../../models/consignment';

// Module imports.
import * as ManifestActions from '../../../actions/manifest_actions';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';

export class BarGraphAttribute extends GenericPlotAttribute{
  render(){
    if(this.props.selected_plot == undefined) return null;

    /*
     * When I rebuilt this component 'ymin', 'ymax', 'datumKey' were undefined.
     * We need to check if these are still used and remove them if not.
     */
    let {selected_plot, data} = this.props;
    let bar_graph_props = {
      data,
      plot: {
        height: selected_plot.layout.height + 100,
        width: selected_plot.layout.width,
        margins: {top: 40, right: 50, bottom: 100, left: 60},
        color_range: ['#cbf2bb', '#46a21f']
      },
    };
  
    return(
      <div className='value'>

        <Resize render={width => (
          <BarGraph {...bar_graph_props} parent_width={width} />
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
  let data = [];
  if(selected_consignment){
    data = selected_consignment.data.map((_label, _value)=>{

      _value = _value.map((label, value)=>{
        return {
          label,
          value 
        };
      })

      _value = _value.reduce((acc, curr)=>{
        return {
          ...acc,
          [curr.label]: curr.value
        }
      }, {});

      return _value;
    });
  }

  /*
   * Set the data required for this plot.
   */
  return {
    data,
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

export const BarGraphAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(BarGraphAttribute);
