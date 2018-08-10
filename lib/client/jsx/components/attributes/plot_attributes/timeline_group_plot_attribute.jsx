import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import TimelinePlot from '../../plotter_d3_v5/plots/timeline_plot/timeline_graph';
import Resize from '../../plotter_d3_v5/resize';

// Module imports.
import {
  requestConsignmentsByManifestId
} from '../../../actions/manifest_actions';
import {
  selectConsignment
} from '../../../selectors/consignment_selector';
import {
  nestDataset
} from '../../../selectors/selector_utils';

export class TimelineGroupPlotAttribute extends GenericPlotAttribute{
  constructor(props){
    super(props);
    this.state = {
      records: null
    };
  }

  static getDerivedStateFromProps(next_props, prev_state){
    if(
      Object.keys(next_props).length <= 0 ||
      next_props.selected_consignment === null
    ) return null;

    return {
      records: next_props.records
    };
  }

  render(){
    let plot_props = {all_events: this.state.records};
    let plot_func = (width)=>{
      return <TimelinePlot {...plot_props} parent_width={width} />;
    };

    return(
      <div id='timeline_group_chart' className='value'>
        {
          this.state.records &&
          <Resize className='resize-component' render={plot_func} />
        }
      </div>
    );
  }
}

const start_date_names = [
  'diagnosis_date',
  'prior_treatment_start',
  'study_treatment_start',
  'start_date'
];

const end_date_names = [
  'prior_treatment_end',
  'study_treatment_end',
  'end_date'
];

const processNameForDate = (name)=>{
  if(start_date_names.indexOf(name) > -1) return 'start';
  if(end_date_names.indexOf(name) > -1) return 'end';
  return name;
};

const processValueForDate = (name, value)=>{
  if(name in start_date_names || name in end_date_names){
    try{
      value = new Date(value).toUTCString();
      if(value == 'Invalid Date') date = null;
    }
    catch(error){
      console.log(`For name: '${name}', value: '${value}' is not a date`);
      value = null;
    }
  }

  return value;
};

const selectColor = (type)=>{
  let colors = [
    '#24a684', // Iliad $dark-color, green
    '#666699', // Janus $grey-purple, purple
    '#3299bb', // CIP $med-blue, blue
    '#680148'  // Polyphemus $maroon, maroon
  ];

  switch(type){
    case 'diagnostics':
      return colors[0];
    case 'prior_treatments':
      return colors[1];
    case 'treatments':
      return colors[2];
    case 'adverse_events':
    case 'prior_adverse_events':
      return colors[3];
    default:
      return colors[0];
  }
}

const flattenDataSet = (object, type)=>{
  let data_obj = {
    [object['name']]: object['value'],
    patient_id: object['patient_id'],
    type,
    event_id: object.uid,
    color: selectColor(type)
  };

  let child_obj = {};
  if('children' in object){
    for(let uid in object['children']){
      child_obj = flattenDataSet(object['children'][uid], type);
      data_obj = Object.assign(data_obj, child_obj);
    }
  }

  return data_obj;
};

// the D3 normalization happens here.
const hashAndNormalizeMatrix = (matrix)=>{
  let data_obj = {};

  matrix.rows.forEach((row, index)=>{
    data_obj[matrix.row_names[index]] = {
      uid: matrix.row_names[index],
      parent_uid: row[0],
      name: processNameForDate(row[1]),
      value: processValueForDate(row[1], row[2]),
      patient_id: row[3]
    };
  });

  return data_obj;
};

const processData = (consignment_data)=>{
  let processed_data = {};
  let records = [];

  for(let key in consignment_data){
    if(key == 'record_name') continue;

    switch(key){
      case 'diagnostics':
      case 'prior_treatments':
      case 'treatments':
        // Extract the data objects from the consignment matrix.
        processed_data[key] = hashAndNormalizeMatrix(consignment_data[key]);

        // Group the data objects by their uids.
        processed_data[key] = nestDataset(
          processed_data[key],
          'uid',
          'parent_uid'
        );

        // Break out the objects into an array that D3 can use.
        for(let uid in processed_data[key]){
          records.push(flattenDataSet(processed_data[key][uid], key));
        }

        break;
      case 'prior_adverse_events':
      case 'adverse_events':
        consignment_data[key].rows.forEach((row, index)=>{
          let ae_obj = {
            name: key,
            label: `AE (${row[4]})`,
            group: row[4],
            patient_id: row[4],
            start: new Date(row[2]).toUTCString(),
            meddra_code: row[0],
            color: selectColor(key),
            event_id: `ae-${key}-${index}`,
            type: key
          };

          if(row[3] != null){
            ae_obj['end'] = new Date(row[3]).toUTCString();
          }

          records.push(ae_obj);
        });
        break;
    }
  }

  return records
};

const mapStateToProps = (state = {}, own_props)=>{
  let records, selected_plot, selected_manifest, selected_consignment=undefined;

  selected_manifest = state.manifests[own_props.attribute.manifest_id];
  if(selected_manifest != undefined){
    selected_consignment = selectConsignment(
      state,
      selected_manifest.md5sum
    );
  }

  if(selected_consignment){
    records = processData(selected_consignment);
  }

  return {
    selected_consignment,
    selected_manifest,
    records
  };
}

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchConsignment: (manifest_id, record_name)=>{
      dispatch(requestConsignmentsByManifestId(
        [manifest_id],
        record_name
      ));
    }
  };
}

export const TimelineGroupAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineGroupPlotAttribute);
