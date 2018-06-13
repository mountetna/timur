// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ClinicalInput from '../inputs/clinical_input';

// Module imports.
import {
  requestDictionaries,
  sendRevisions,
  //reviseDocument
} from '../../actions/magma_actions';

import {
  selectModelDocuments
} from '../../selectors/magma_selector';

import {
  selectDictionary
} from '../../selectors/dictionary_selector';

import {
  nestDataset,
  setDefinitionUids,
  setSiblingUids
} from '../../selectors/selector_utils.js';

export class ClinicalAttribute extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      dictionary_requested: false,
      records: {},
      dictionary: {},
      nested_uids: {}
    };
  }

  componentDidUpdate(){

    let {dictionary, requestDictionaries} = this.props;

    // Check for a dictionary to fetch that corresponds to a model/component.
    if(
      this.state.dictionary_requested ||
      !('name' in dictionary) ||
      dictionary.name == undefined
    ) return;

    requestDictionaries({dictionary_name: dictionary.name}, dictionary.project);
    this.setState({dictionary_requested: true});
  }

  static getDerivedStateFromProps(next_props, prev_state){

    // If there is no data to update then return.
    if(
      Object.keys(next_props.records).length <= 0 ||
      Object.keys(next_props.dictionary).length <= 0
    ) return null;

    return {
      records: next_props.records,
      dictionary: next_props.dictionary,
      nested_uids: next_props.nested_uids
    };
  }

  sendRevisionIntermediate(){
    /*
    let revisions = {}
    let records = this.state.records;
    for(let uid in records){
      if(records[uid].revised == true){

        revisions[uid] = {
          uid: uid,
          parent_uid: records[uid].parent_uid,
          subject_id: this.props.document.subject_id,
          name: records[uid].name,
          value: records[uid].value,
          restricted: true
        };
      }
    }

    let revision_args = {
      model_name: this.props.attribute.name,
      revisions
    };

    this.props.sendRevisions(revision_args);
    */
  }

  // Extract the defintions required for key inputs.
  selectDefinitionsForKeys(uids){
    let definitions = {};

    uids.forEach((uid)=>{
      let def = this.state.dictionary.definitions[uid];
      if(!(def.name in definitions)){
        definitions[def.name] = Object.assign({}, def);
        definitions[def.name].value = definitions[def.name].name;
      }
    });

    return Object.keys(definitions).map((def_name)=>{
      return definitions[def_name];
    });
  }

  // Extract the definitions required for value inputs.
  selectDefinitionsForValues(uids){
    return uids.map((uid)=>{
      let def = Object.assign({}, this.state.dictionary.definitions[uid]);
      def['label'] = def.value;
      return def;
    });
  }

  selectSiblings(parent_uid){
    let definitions = this.state.dictionary.definitions;
    let siblings = [];

    for(let uid in definitions){
      if(parent_uid != definitions[uid].parent_uid) continue;
      siblings.push(uid);
    }

    return siblings;
  }

  setNestedUidRevision(rev_uid, revision, nested_uids){
    for(let uid in nested_uids){
      if(rev_uid == uid){
        nested_uids[uid] = Object.assign({}, nested_uids[uid], revision);
      }

      if('children' in nested_uids[uid]){
        nested_uids[uid].children = this.setNestedUidRevision(
          rev_uid,
          revision,
          nested_uids[uid].children
        );
      }
    }

    return nested_uids;
  }

  nestedUidHasChildren(orig_uid, nested_uids){
    let hasChildren = false;
    for(let uid in nested_uids){

      if(Object.keys(nested_uids[uid].children).length > 0){
        if(orig_uid == uid){
          return true;
        }
        else{
          hasChildren = this.nestedUidHasChildren(
            orig_uid,
            nested_uids[uid].children
          );
        }
      }
    }

    return hasChildren;
  }

  setRecordRevision(uid, revision, records){
    records[uid] = Object.assign({}, records[uid], revision);
    return records;
  }

  setChildren(def_parent_uid, rec_parent_uid){
    let child_recs = {};
    let child_defs = {};
    let child_siblings = [];
    let defs = this.state.dictionary.definitions;

    for(let def_uid in defs){
      if(defs[def_uid].parent_uid == def_parent_uid){

        // Add to the sibling grouping.
        child_siblings.push(def_uid);

        // For each unique named definition we add a child record.
        if(!(defs[def_uid].name in child_defs)){

          let random_uid = Math.random().toString(16).slice(2, -1);

          // Set initial child nested ids.
          child_defs[defs[def_uid].name] = {
            uid: random_uid,
            definition: null,
            definitions: [def_uid],
            children: {}
          };

          // Set unique child record.
          child_recs[random_uid] = {
            uid: random_uid,
            parent_uid: rec_parent_uid,
            name: defs[def_uid].name,
            revised: true,
            value: null
          };
        }
        else{

          // Append the definion uid to the child.
          child_defs[defs[def_uid].name].definitions.push(def_uid);
        }
      }
    }

    // Remap the child_defs to make the uid the key.
    let new_child_defs = {}
    for(let name in child_defs){
      new_child_defs[child_defs[name].uid] = child_defs[name];
      new_child_defs[child_defs[name].uid].siblings = child_siblings;
    }

    let child_uids = {
      uid: rec_parent_uid,
      children: new_child_defs
    };

    return [child_recs, child_uids];
  }

  reviseRecord(event){
    let revision_records = {
      uid: event.target.dataset.uid,
      value: event.target.value,
      revised: true
    };

    // Pull the definition uid for the revised data.
    let defs = this.state.dictionary.definitions;
    let def = Object.keys(defs).filter((uid)=>{
      if(
        defs[uid].name == event.target.dataset.name &&
        defs[uid].value == event.target.value
      ) return defs[uid];
    });

    // Make sure the definition is properly set.
    let revision_uids = {
      uid: event.target.dataset.uid,
      definition: def[0],
    }

    // The basic data to update.
    let records = this.setRecordRevision(
      event.target.dataset.uid,
      revision_records,
      this.state.records
    );

    let nested_uids = this.setNestedUidRevision(
      event.target.dataset.uid,
      revision_uids,
      this.state.nested_uids
    );

    // If there are no definitions here then there should be no children.
    if(def.length > 0){

      // The data to update for the children.
      let children = this.setChildren(def[0], event.target.dataset.uid);
      let child_records = children[0];
      let child_uids = children[1];

      if(!this.nestedUidHasChildren(child_uids.uid, nested_uids)){
        records = Object.assign(records, child_records);

        nested_uids = this.setNestedUidRevision(
          event.target.dataset.uid,
          child_uids,
          nested_uids
        );
      }
    }

    this.setState({records, nested_uids});
  }

  reviseKey(event){

    let {records, nested_uids} = this.state;

    // Set the name of the definition we chose.
    let revision_records = {
      uid: event.target.dataset.uid,
      name: event.target.value
    };

    // Extract the id's for matching definitions.
    let defs = this.state.dictionary.definitions;
    let revision_uids = {
      uid: event.target.dataset.uid,
      definition: null,
      definitions: Object.keys(defs).filter((uid)=>{
        if(defs[uid].name == event.target.value) return uid;
      })
    };

    /*
     * If there is a single definition it means that this is not a multi-select.
     * Which also means we can set the sub children.
     */
    let child_records, child_uids;
    if(revision_uids.definitions.length == 1){
      revision_uids.definition = revision_uids.definitions[0];

      let children = this.setChildren(
        revision_uids.definitions[0],
        event.target.dataset.uid
      );

      child_records = children[0];
      child_uids = children[1];
    }

    records = this.setRecordRevision(
      event.target.dataset.uid,
      revision_records,
      this.state.records
    );

    nested_uids = this.setNestedUidRevision(
      event.target.dataset.uid,
      revision_uids,
      this.state.nested_uids
    );

    if(child_records) records = Object.assign(records, child_records);
    if(child_uids){
      nested_uids = this.setNestedUidRevision(
        event.target.dataset.uid,
        child_uids,
        nested_uids
      );
    }

    this.setState({records, nested_uids});
  }

  addRecord(){
    let random_uid = Math.random().toString(16).slice(2, -1);

    let records = this.state.records;
    records[random_uid] = {
      uid: random_uid,
      name: null,
      parent_uid: null,
      value: null,
      revised: false
    };

    let nested_uids = this.state.nested_uids;
    nested_uids[random_uid] = {
      uid: random_uid,
      siblings: this.selectSiblings(null),
      definitions: [],
      definition: null,
      children: {}
    }

    this.setState({records, nested_uids});
  }

  renderRemoveBtn(is_parent){
    if(!is_parent) return null;

    let remove_btn_props = {
      className: 'clinical-record-rm-btn',
      title: 'Remove record.',
      style: {
        display: (this.props.mode == 'edit') ? '' : 'none'
      },
      onClick: (event)=>{
        console.log(event);
      }
    };

    let remove_btn = (
      <button {...remove_btn_props}>

        <i className='fa fa-times'></i>
      </button>
    );
  }

  renderRecord(uid_set, is_parent){

    let child_elements = [];
    for(let uid in uid_set.children){
      child_elements.push(this.renderRecord(uid_set.children[uid], false));
    }

    let record = this.props.records[uid_set.uid];
    let definition = this.props.dictionary.definitions[uid_set.definition];
    let type = null;
    if(uid_set.definitions.length > 0){
      type = this.props.dictionary.definitions[uid_set.definitions[0]].type;
    }

    let multi_select = ['regex', 'dropdown', 'select', 'boolean'];
    let input_value_props = {
      uid: uid_set.uid,
      name: record.name,
      type: type,
      value: record.value,
      values: this.selectDefinitionsForValues(uid_set.definitions),
      def_ids: uid_set.definitions,
      editing: (
        (multi_select.indexOf(type) == -1 || child_elements.length == 0) &&
        this.props.mode == 'edit'
      ),
      onChange: this.reviseRecord.bind(this)
    };

    let input_name_props = {
      uid: uid_set.uid,
      name: record.name,
      type: 'key',
      value: record.name,
      values: this.selectDefinitionsForKeys(uid_set.siblings),
      def_ids: uid_set.definitions,
      editing: (record.name == null && this.props.mode == 'edit'),
      onChange: this.reviseKey.bind(this)
    };

    let group_props = {
      className: 'clinical-record-group',
      key: `record_${record.uid}`
    };

    return(
      <div {...group_props}>

        <ClinicalInput {...input_name_props} />
        <ClinicalInput {...input_value_props} />
        {this.renderRemoveBtn(is_parent)}
        {child_elements}
      </div>
    );
  }

  renderData(){
    let {records, dictionary, nested_uids} = this.state;

    // Check that all the required data to render is present.
    if(
      Object.keys(records).length <= 0 ||
      Object.keys(dictionary).length <= 0 ||
      Object.keys(dictionary.definitions).length <= 0
    ) return null;

    // Loop the records and render them by group.
    let elements = [];
    for(let uid in nested_uids){
      elements.push(this.renderRecord(nested_uids[uid], true))
    };

    return elements;
  }

  renderEditButtons(){
    let {records, dictionary} = this.state;

    // Check that all the required data to render is present.
    if(
      Object.keys(records).length <= 0 ||
      Object.keys(dictionary).length <= 0 ||
      Object.keys(dictionary.definitions).length <= 0
    ) return null;

    let display = (this.props.mode == 'edit') ? 'block' : 'none';
    let add_btn_props = {
      className: 'clinical-record-btn',
      style: {display},
      onClick: this.addRecord.bind(this)
    };

    let save_btn_props = {
      className: 'clinical-record-btn',
      //style: {display},
      style: {display: 'none'},
      onClick: this.sendRevisionIntermediate.bind(this)
    };

    return(
      <div className='clinical-record-edit-group'>

        <button {...add_btn_props}>

          <i className='fa fa-plus'></i>
          {' ADD'}
        </button>
        <button {...save_btn_props}>

          <i className='fa fa-plus'></i>
          {' SAVE'}
        </button>
      </div>
    );
  }

  render(){
    return(
      <div className='clinical-group'>

        {this.renderData()}
        {this.renderEditButtons()}
      </div>
    );
  }
}

const mapStateToProps = (state, own_props)=>{
  /*
   * The main goal of processing the data here is to:
   * 1. Attach the basic defintions to the documents.
   * 2. Nest the documents in their proper hierarchy.
   */

  let dictionary = selectDictionary(state, own_props.attribute.model_name);
  let records = selectModelDocuments(state, own_props.attribute.model_name);

  /*
   * Trim out 'identifier serch' items. We need fix the identifier search to not
   * use these.
   */
  for(let uid in records){
    if(!('name' in records[uid])) delete records[uid];
  }

  let uid_set = setDefinitionUids(records, dictionary , {});
  uid_set = setSiblingUids(records, dictionary, uid_set);
  uid_set = nestDataset(uid_set, 'uid', 'parent_uid');

  return {
    records: records,
    dictionary: dictionary,
    nested_uids: uid_set
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestDictionaries: (args, project_name)=>{
      dispatch(requestDictionaries(args, project_name));
    },

    sendRevisions: (args)=>{
      dispatch(sendRevisions(args));
    }
  };
};

export const ClinicalAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ClinicalAttribute);
