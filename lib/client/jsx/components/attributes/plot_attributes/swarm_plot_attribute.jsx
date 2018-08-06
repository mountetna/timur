// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';
import * as ManifestActions from '../../../actions/manifest_actions';
import Swarm from '../../plotter/plots/swarm';
import {GenericPlotAttribute} from './generic_plot_attribute';

export class SwarmPlotAttribute extends GenericPlotAttribute{
  render(){

    if(!this.props.selected_consignment) return null;

    let {
      data,
      attribute,
      selected_plot
    } = this.props;

    let {
     xLabel,
     yLabel,
     xmin,
     xmax,
     datumKey,
     groupByKey,
     legend,
     legendKey,
     name,
     layout
    } = selected_plot;

    let {
      height,
      width,
      margin
    } = layout;

    return(
      <div className='value'>
       {data[0] &&
         <Swarm
           data={data}
           plot={{name, width, height}}
           margin={margin}
           xmin={xmin}
           xmax={xmax}
           xLabel={xLabel}
           yLabel={yLabel}
           datumKey={datumKey}
           groupByKey={groupByKey}
           legend={legend}
           legendKey={legendKey}
         />
       }
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
    const dataMatrix = selected_consignment.data

    let data = [];

    //create rows from matrix
    for (let i = 0; i < dataMatrix.num_rows; i++) {
      let row = {}

      //create row by adding columns as attributes
      for (let j = 0; j < dataMatrix.num_cols; j++) {
        row = {
         ...row,
         [dataMatrix.col_names[j]]: dataMatrix.row(i)[j]
        }
      }

      //add calculated_columns as attributes
      const calculatedColumns = selected_plot.calculated_columns.reduce((acc, curr) => {
        return {
          ...acc,
          [curr]: selected_consignment[curr].values[i]
        }
      }, {})
      row = {...row, ...calculatedColumns}

      data.push(row)
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

export const SwarmPlotAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(SwarmPlotAttribute);
