import * as React from 'react';
import * as ReactRedux from 'react-redux';
import StackedBarPlot from '../../plotter/plots/stacked_bar_plot';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';
// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import Consignment from '../../../models/consignment';
// Module imports.
import * as ManifestActions from '../../../actions/manifest_actions';

export class StackedBarPlotAttribute extends GenericPlotAttribute{

  render(){

    if(!this.props.selected_consignment) return null;

    let {
      data,
      attribute,
      selected_plot
    } = this.props;

    let {
      datumKey,
      legend,
      ymin,
      ymax,
      name,
      order_by,
      layout
    } = selected_plot;

    let {
      height,
      width,
      margin
    } = layout;

    return(
      <div className="value">
    {data[0] &&
      <StackedBarPlot
        ymin={ymin}
        ymax={ymax}
        plot={{name, width, height}}
        margin={margin}
        data={data}
        legend={legend}
      />}
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

  if (selected_consignment) {
    let {order_by} = selected_plot;
    const allValues = selected_consignment.data.map((label, value,) => {
      return value.map((valueLabel, value) => {
        return {
          id: valueLabel,
          [label]: value
        }
      })
    }).reduce((acc, curr) => [...acc, ...curr], [])

    const objectsOfValuesGroupedById = allValues.reduce((acc, curr) => {
      if (acc[curr.id]) {
        return {
          ...acc,
          [curr.id]: {
            ...acc[curr.id],
            ...curr
          }
        }
      } else {
        return {
          ...acc,
          [curr.id]: curr
        }
      }
    }, {})

    let data = Object.values(objectsOfValuesGroupedById)
    if (order_by) {
      data.sort((a, b) => a[order_by] - b[order_by])
    }

    return {
      data,
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
  }
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

export const StackedBarPlotAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(StackedBarPlotAttribute);
