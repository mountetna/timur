// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import Histogram from '../../plotter/plots/histogram';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';
import * as ManifestActions from '../../../actions/manifest_actions';
import {GenericPlotAttribute} from './generic_plot_attribute';

export class HistogramAttribute extends GenericPlotAttribute{
  render(){
    if(!this.props.selected_consignment) return null;

    let {
      selected_plot,
      data,
      xmin,
      xmax,
    } = this.props;

    let {
      name,
      layout,
      interval,
      xLabel,
      yLabel,
      ymax
    } = selected_plot

    let histogram_props = {
      plot: {
        name,
        width: layout.width,
        height: layout.height
      },
      interval,
      xLabel,
      yLabel,
      ymax,
      data,
      margin: layout.margin
    };

    return(
      <div className='value'>

        {data[0] && <Histogram {...histogram_props} />}
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

  if(selected_consignment){
    let {xmin, xmax, data} = selected_consignment;

    return {
      data: data.values,
      xmin,
      xmax,
      selected_plot,
      selected_manifest,
      selected_consignment
    };
  }

  return {
    data: [],
    selected_plot,
    selected_manifest,
    selected_consignment
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchConsignment: (manifest_id, record_name)=>{
      dispatch(ManifestActions.requestConsignmentsByManifestId(
        [manifest_id],
        record_name
      ));
    }
  };
};

export const HistogramAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(HistogramAttribute);
