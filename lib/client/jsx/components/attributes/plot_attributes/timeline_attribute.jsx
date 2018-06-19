// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import TimelinePlot from '../../plotter/plots/timeline_plot/timeline_plot';
import Resize from '../../plotter/plots/timeline_plot/resize';

// Module imports.
import * as ManifestActions from '../../../actions/manifest_actions';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';
import {nestDataset} from '../../../selectors/selector_utils.js';

export class TimelineAttribute extends GenericPlotAttribute{
  constructor(props) {
    super(props);

    this.state = {
      records: null,
    };
  }

  static getDerivedStateFromProps(next_props, prev_state){

    if(
        Object.keys(next_props).length <= 0 || 
        next_props.selected_consignment === null
    ) {return null;}

    return {
      records: next_props.records
    };
  }

  render(){ 
    let plot_props = {
      all_events: this.state.records,
      color:'#29892a'
    }

    return(
      <div id='timeline_charts' className='value-timeline'>
        {this.state.records && <Resize render={(width) => (
          <TimelinePlot 
            {...plot_props}
            parent_width={width} 
          />
        )}/>}
      </div>
    )
  }
}

/* 
 * This is a temporary shim. Key for date should be normalized in the
 * database.
 */
let normalizeDateName = (name) => {
  switch(name) {
    case 'prior_treatment_start':
    case 'study_treatment_start':
    case 'start_date':
      return 'start';
    case 'prior_treatment_end':
    case 'study_treatment_end':
    case 'end_date':
      return 'end';
    default:
      return name;
  } 
}

let hashPatientData = (hashed_obj, array) => {
  for(let category of array) {
    if(category) {
      for(let index = 0; index < category.row_names.length; ++index){

        let uid = category.row_names[index];
        hashed_obj[uid] = {
          uid: uid,
          parent_uid: category.rows[index][0],
          name: normalizeDateName(category.rows[index][1]),
          value: category.rows[index][2]
        };
      }
    }
  }
}

let uniqueLabelByDate = (array) => {
  array.sort((a,b) => {
    return new Date(a.start) - new Date(b.start);
  });
  array.map((obj, index) => {
    obj.label = `${obj.label} ${++index}`;
  });
  return array;
}

let flatten = (nested_obj, array, level) => {
  array = array || [];
  level = level || 1;
  for(let obj in nested_obj) {
    array.push({
      name: `${'· '.repeat(level)} ${nested_obj[obj].name.replace(/_/g, ' ')}`,
      value: nested_obj[obj].value,
    })
    if (
        typeof nested_obj[obj].children === "object" && 
        Object.keys(nested_obj[obj].children).length !== 0
    ) {
       let next_level = level + 1;
       flatten(nested_obj[obj].children, array, next_level);
      }
  }
  return array;
}

let normalizePatientDataD3 = (records) => {
  let d3_records = [];
  for(let record in records) {
    let d3_record = {};
    d3_record.data = [];
    d3_record.name = records[record].name;
    d3_record.label = records[record].name.replace(/[_-]/g, " "); 

    if(records[record].name === 'diagnosis_date') {
      let time_str = new Date(records[record].value).toUTCString();
      let parts = time_str.split(' ');
      let utc_time_str = `${parts[1]}-${parts[2]}-${parts[3]}`;
      d3_record.start = utc_time_str;
    }

    for(let child in records[record].children) {
      let  name = records[record].children[child].name;

      if(name === 'start' || name === 'end'){
        d3_record[name]=records[record].children[child].value;
      } 
      else {

        d3_record.data.push({
          name: records[record].children[child].name.replace(/_/g, ' '),
          value: records[record].children[child].value,
          children: records[record].children[child].children
        });

        if(records[record].children[child].children !== null) {
          let array = flatten(records[record].children[child].children);
          d3_record.data = [...d3_record.data, ...array];
        }
      }
    
    }
    d3_records.push(d3_record);
  }
  // Group patient data by type 
  let prior_treatment_arr = [];
  let treatment_arr = [];
  let diagnostic_arr = [];

  d3_records.forEach(record => {
    switch(record.name) {
      case 'diagnosis_date':
        diagnostic_arr.push(record)
        break;
      case 'prior_treatment':
        prior_treatment_arr.push(record)
        break;
      case 'study_treatment':
        treatment_arr.push(record)
        break;
      default:
          break;
    }
  })

  prior_treatment_arr = uniqueLabelByDate(prior_treatment_arr);
  treatment_arr = uniqueLabelByDate(treatment_arr);
  diagnostic_arr = uniqueLabelByDate(diagnostic_arr);

  return [...prior_treatment_arr, ...treatment_arr, ...diagnostic_arr];
}

let normalizeAEPatientDataD3 = (hashed_obj, array) => {
  let adverse_events_arr = [];
  let prior_adverse_events_arr = [];
    
  // create hashed objects for adverse events data.
  for(let category of array){
    if(category) {
      for(let index = 0; index < category.rows.length; ++index){
        let meddra_code = category.rows[index][0];
        let utc_start_str;
        let utc_end_str; 

        if(category.rows[index][2]){
          let start = category.rows[index][2].toString().split(' ');
          utc_start_str  = `${start[2]}-${start[1]}-${start[3]}`;
        }

        if(category.rows[index][3]){
          let end = category.rows[index][3].toString().split(' ');
          utc_end_str  = `${end[2]}-${end[1]}-${end[3]}`;
        }

        hashed_obj[meddra_code] = {
          data: [{name: 'Grade', value: category.rows[index][1]}],
          start: utc_start_str || null,
          end: utc_end_str || null,
          name: category.rows[index][4],
          label: category.rows[index][4]
        };

        if(hashed_obj[meddra_code].name === 'adverse_events'){
          adverse_events_arr.push(hashed_obj[meddra_code]);
        }

        if(hashed_obj[meddra_code].name === 'prior_adverse_events'){
          prior_adverse_events_arr.push(hashed_obj[meddra_code]);
        }
      }
    }
  }

  adverse_events_arr = uniqueLabelByDate(adverse_events_arr);
  prior_adverse_events_arr = uniqueLabelByDate(prior_adverse_events_arr);

  return [...adverse_events_arr, ...prior_adverse_events_arr]
};

const mapStateToProps = (state = {}, own_props)=>{
  /*
   * Pull the data required for this plot.
   */
  let selected_plot, selected_manifest, selected_consignment = undefined;
  let records;
  
  // selected_plot = state.plots.plotsMap[own_props.attribute.plot_id];
  // if(selected_plot != undefined){
  //   selected_manifest = state.manifests[selected_plot.manifest_id];
  // }

  selected_manifest = state.manifests['179'];

  if(selected_manifest != undefined){
    selected_consignment = ConsignmentSelector.selectConsignment(
      state,
      selected_manifest.md5sum_data
    );
  }
  
  if(selected_consignment) {
    let {
      diagnostic_data, 
      treatment_data,
      prior_treatment_data,
      adverse_events,
      prior_adverse_events
      } = selected_consignment;

    let hashed_obj = {};
  
    let patient_data = [
      diagnostic_data, 
      treatment_data,
      prior_treatment_data,
    ];

    let ae_patient_data = [
      adverse_events,
      prior_adverse_events
    ];
 
    hashPatientData(hashed_obj, patient_data);
    hashed_obj = nestDataset(hashed_obj, 'uid', 'parent_uid');
    records = normalizePatientDataD3(hashed_obj);

    prior_adverse_events.col_names.push('name');
    prior_adverse_events.rows.map(row => {row.push('prior_adverse_events');});
    adverse_events.col_names.push('name');
    adverse_events.rows.map(row => {row.push('adverse_events');});
    let ae_records = normalizeAEPatientDataD3(hashed_obj, ae_patient_data);

    records = [...ae_records, ...records];  
  }

  return {
    selected_plot,
    selected_manifest,
    selected_consignment,
    records,
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

export const TimelineAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineAttribute);
