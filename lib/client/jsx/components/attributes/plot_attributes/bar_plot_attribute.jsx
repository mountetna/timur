// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import BarPlot from '../../plotter/plots/bar_plot';
import Consignment from '../../../models/consignment';

// Module imports.
import * as ManifestActions from '../../../actions/manifest_actions';
import * as Colors from '../../../utils/colors';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';

export class BarPlotAttribute extends GenericPlotAttribute{
  render(){
    let { selected_plot, template, bars } = this.props;
    if (!selected_plot) return null;

    let bar_plot_props = {
      ymin: 0,
      ymax: 1,
      legend: selected_plot.legend,
      plot: selected_plot.layout,
      model_name: template ? template.name : null,
      bars
    };

    return(
      <div className='value'>

        <BarPlot {...bar_plot_props} />
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
  let bars = [];
  if(selected_consignment && selected_consignment.bars){
    bars = selected_consignment.bars.map((_, bar, index)=>{
      return {
        name: bar('name'),
        color: bar('color'),
        heights: bar('height'),
        category: bar('category'),
        highlight_names: bar('highlight_names') ? bar('highlight_names').values : bar('height').labels,
        select: bar('select').which((value) => value)[0],
        similar: bar('similar') ? bar('similar').values : undefined
      };
    });
  }

  /*
   * Set the data required for this plot.
   */
  return {
    bars,
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

export const BarPlotAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(BarPlotAttribute);
