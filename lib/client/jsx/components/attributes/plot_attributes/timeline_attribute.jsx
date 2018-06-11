// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericPlotAttribute} from './generic_plot_attribute';
import Consignment from '../../../models/consignment';
import TimelinePlot from '../../plotter/plots/timeline_plot';
import Resize from '../../plotter/resize';

// Module imports.
import * as ManifestActions from '../../../actions/manifest_actions';
import * as ConsignmentSelector from '../../../selectors/consignment_selector';
import {nestDataset} from '../../../selectors/selector_utils.js';
import { EMLINK } from 'constants';

export class TimelineAttribute extends GenericPlotAttribute{
  constructor(props) {
    super(props)

    this.state = {
      diagnostic: null,
      prior_treatment: null,
      treatment: null
    };
  }

  static getDerivedStateFromProps(next_props, prev_state){

    if(
      Object.keys(next_props).length <= 0 || 
      next_props.selected_consignment === null
    ) {return null;}

    return {
      diagnostic: next_props.selected_consignment.diagnostic_data,
      prior_treatment: next_props.selected_consignment.prior_treatment_data,
      treatment: next_props.selected_consignment.treatment_data
    };
  }
  /* 
   * This is a temporary shim. Key for date should be normalized in the
   * database.
   */
  normalizeDateName(name) {
    switch(name) {
      case 'prior_treatment_start':
      case 'study_treatment_start':
        return 'start';
      case 'prior_treatment_end':
      case 'study_treatment_end':
        return 'end';
      default:
        return name;
    } 
  }

  uniqueLabelByDate(array){
    array.sort((a,b) => {
      return new Date(a.start) - new Date(b.start);
    });
    array.map((obj, index) => {
      obj.label = `${obj.label} ${index+1}`;
    });
    return array;
  }

  normalizeD3Records(records) {
    let d3Records = [];
    for (let record in records) {
      let d3Record = {};
      d3Record.data = [];
      d3Record.name = records[record].name;
      d3Record.label = records[record].name.replace(/[_-]/g, " "); 

      if (records[record].name === 'diagnosis_date') {
        let time_str = new Date(records[record].value).toUTCString();
        let parts = time_str.split(' ');
        let utc_time_str = `${parts[1]}-${parts[2]}-${parts[3]}`;
        d3Record.start = utc_time_str;
      }

      for (let child in records[record].children) {
        let  name = records[record].children[child].name;

        if (name === 'start' || name === 'end'){
          d3Record[name]=records[record].children[child].value;
        } 
        else {
          d3Record.data.push({
            name: records[record].children[child].name,
            value: records[record].children[child].value,
            children: records[record].children[child].children
          })
        }
      
      }
      d3Records.push(d3Record);
    }

    let prior_treatment_arr = [];
    let treatment_arr = [];
    let diagnostic_arr = [];

    d3Records.forEach(record => {
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

    prior_treatment_arr = this.uniqueLabelByDate(prior_treatment_arr);
    treatment_arr = this.uniqueLabelByDate(treatment_arr);
    diagnostic_arr = this.uniqueLabelByDate(diagnostic_arr);

    return [...prior_treatment_arr, ...treatment_arr, ...diagnostic_arr];
  }

  render(){
    let {diagnostic, prior_treatment, treatment} = this.state;    
    let patient_data = [diagnostic, prior_treatment, treatment];
    let hashed_obj = {};
    let records;

    for (let category of patient_data) {
      if (category) {
        for(let index = 0; index < category.row_names.length; ++index){
          let uid = category.row_names[index];
          hashed_obj[uid] = {
            uid: uid,
            parent_uid: category.rows[index][0],
            name: this.normalizeDateName(category.rows[index][1]),
            value: category.rows[index][2]
          };
        }
      }
    }
    hashed_obj = nestDataset(hashed_obj, 'uid', 'parent_uid');
    records = this.normalizeD3Records(hashed_obj);
  
    return(
      <div id='timeline_charts' className='value-timeline'>
        <Resize render={ (width) => (
          <TimelinePlot 
            all_events = {records} 
            parent_width={width} 
            hover = {this.mouseEnter}
            leave = {this.mouseExit}
          />
        )}/>
      </div>
    )
  
  }
}

const mapStateToProps = (state = {}, own_props)=>{
  /*
   * Pull the data required for this plot.
   */
  let selected_plot, selected_manifest, selected_consignment = undefined;
  
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
  return {
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

export const TimelineAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TimelineAttribute);
