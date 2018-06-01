// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ClinicalInput from '../inputs/clinical_input';

// Module imports.
import {
  requestDictionaries,
  reviseDocument
} from '../../actions/magma_actions';

import {
  selectModelDocuments,
  selectModelTemplate
} from '../../selectors/magma_selector';

import {
  selectDictionary,
  selectNestedDictionary
} from '../../selectors/dictionary_selector';

import {
  nestDataset,
  interleaveDictionary,
  excludeCheckboxFields
} from '../../selectors/selector_utils.js';


export class ClinicalAttribute extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      dictionary_requested: false,
      documents: {},
      dictionary: {}
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

    if(
      Object.keys(next_props.documents).length <= 0 ||
      Object.keys(next_props.dictionary).length <= 0
    ) return null;

    return {
      documents: next_props.documents,
      dictionary: next_props.dictionary
    };
  }

  // When we add a new record, this is the object that is used as the template.
  createEmptyRecordObject(){
    return {
      id: null,
      name: null,
      parent_id: null,
      definitions: {},
      peers: {},
      children: {},
      value: null,
      values: null,
      type: null,
      revised: false
    };
  }

  selectPeers(parent_id){
    let definitions = this.state.dictionary.definitions;
    let peers = {};

    for(let id in definitions){
      let def = definitions[id];
      if(def.parent_id != parent_id) continue;

      // We sort the peers by name and add the labels and ids.
      if(!(def.name in peers)) peers[def.name] = {ids: [], label: def.label};
      peers[def.name].ids.push(def.id);
    }

    return peers;
  }

  selectDefintions(name){
    let definitions = this.state.dictionary.definitions;
    let definition = {values: []};
    let keys = ['id', 'type', 'label', 'project'];

    for(let id in definitions){
      let def = definitions[id];
      if(def.name != name) continue;

      keys.forEach((key)=>{
        if(!(key in definition)) definition[key] = def[key];
      });

      if(def.value != null) definition.values.push(def.value);
    }

    if(definition.values.length <= 0) delete definition.values;
    return definition;
  }

  selectChildren(parent_id, def_parent_id){
    let definitions = this.state.dictionary.definitions;
    let children = {};
    
    for(let id in definitions){
      let def = definitions[id];
      if(def.parent_id != def_parent_id) continue;
      if(!(def.name in children)){
        
        /*
         * We are using the definition name to condense the definition around a
         * child element.
         */
        let random_id = Math.random().toString(16).slice(2, -1);
        children[def.name] = Object.assign(
          this.createEmptyRecordObject(),
          {
            id: random_id,
            name: def.name,
            parent_id: parent_id,
            definitions: this.selectDefintions(def.name),
            peers: this.selectPeers(def_parent_id),
            type: def.type
          }
        );
      }
    }

    // Remap the children with the ids.
    let new_children = {}
    for(let key in children){
      new_children[children[key].id] = children[key];
    }

    return new_children;
  }

  reviseKey(event){

    let definitions = this.selectDefintions(event.target.value);
    let revision_data = {
      id: event.target.dataset.id,
      name: event.target.value,
      type: definitions.type,
      definitions
    };

    /*
     * If the key selection is not a multiselect item we can go ahead and set
     * the empty children objects.
     */
    let multi_select = ['regex', 'dropdown', 'select', 'boolean', 'checkbox'];
    if(multi_select.indexOf(definitions.type) == -1){
      revision_data['children'] = this.selectChildren(
        event.target.dataset.id,
        definitions.id
      );
    }

    let documents = this.setRevision(revision_data, this.state.documents, true);
    this.setState({documents});
  }

  /*
   * Adding a record is a multi step process.
   *
   * 1. We add a record object to the local component store. This object does
   *    not contain a 'name' or 'value', but it does contain 'peers'. This tells
   *    the UI to render a selector but not set a value.
   *
   * 2. We select an initial key for the record. This action will set a 'value'
   *    on the record and causes it's 'children' and 'definition' objects to be
   *    set as well. This, in turn, causes any child selections to render. Those
   *    child values will still be 'null'.
   *
   * 3. 
   */

  addRecord(){
    let random_id = Math.random().toString(16).slice(2, -1);
    let new_record = Object.assign(
      this.createEmptyRecordObject(),
      {
        id: random_id,
        peers: this.selectPeers(null),
        revised: true
      }
    );

    let documents = this.state.documents;
    documents[random_id] = new_record;
    this.setState({documents});
  }

  setRevision(revision_data, documents, from_key){

    for(let id in documents){
      let doc = documents[id];

      if(revision_data.id == id){
        doc['revised'] = true;
        doc = Object.assign(doc, revision_data);
      }

      /*
       * If there are children objects we recurse over them to possibly set the
       * correct data. Otherwise, we create new blank children objects. This
       * would indicate that we are filling in a new nested record group. The
       * child object can also end up being empty if the current 'doc' is an
       * end node.
       */
      if(Object.keys(doc.children).length > 0){
        doc.children = this.setRevision(revision_data, doc.children, from_key);
      }
      else{
        if(!from_key){
          doc.children = this.selectChildren(id, doc.definitions.id);
        }
      }
    }

    return documents;
  }

  reviseDocument(event){

    let revision_data = {
      id: event.target.dataset.id,
      name: event.target.dataset.name,
      value: event.target.value
    };

    // get document/record check for children. If no children then set children.

    let documents = this.setRevision(revision_data, this.state.documents, false);
    this.setState({documents});
  }

  /*
   * When editing records we need to restrict which records can be edited. Since
   * the records can be nested and subsequent selections are based upon
   * previous selections (i.e. what you can select is based upon what you've 
   * already selected) we restrict the changing of fields to the end nodes of
   * the selection trees.
   */

  renderRecord(record, is_parent){

    let child_elements = [];
    for(let id in record.children){
      child_elements.push(this.renderRecord(record.children[id], false));
    }

    let rev_class = (record.revised) ? 'clinical-record-revised' : '';
    let group_props = {
      className: `clinical-record-group ${rev_class}`,
      key: `record_${record.id}`
    };

    let multi_select = ['regex', 'dropdown', 'select', 'boolean'];
    let input_value_props = Object.assign(
      {},
      record,
      {
        /*
         * If the value is not a selector, it has no children, and edit mode is
         * active, allow this input to be editable.
         */
        editing: (
          (
            multi_select.indexOf(record.type) == -1 ||
            child_elements.length == 0
          ) &&
          this.props.mode == 'edit'
        ),
        onChange: this.reviseDocument.bind(this)
      }
    );

    let input_name_props = Object.assign(
      {},
      record,
      {
        type: 'key',
        value: record.name,
        editing: (record.name == null && this.props.mode == 'edit'),
        onChange: this.reviseKey.bind(this)
      }
    );

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

    return(
      <div {...group_props}>

        <ClinicalInput {...input_name_props} />
        <ClinicalInput {...input_value_props} />
        {(is_parent) ? remove_btn : null}
        {child_elements}
      </div>
    );
  }

  renderData(){
    let {documents, dictionary} = this.state;

    // Check that all the required data to render is present.
    if(
      Object.keys(documents).length <= 0 ||
      Object.keys(dictionary).length <= 0 ||
      Object.keys(dictionary.definitions).length <= 0
    ) return <div>{'No Entries'}</div>;

    // Loop the documents/records and render them by group.
    let elements = [];
    for(let id in documents){
      elements.push(this.renderRecord(documents[id], true));
    }

    return elements;
  }

  renderEditButtons(){
    //if(this.props.mode != 'edit') return null;

    let display = (this.props.mode == 'edit') ? 'block' : 'none';
    let add_btn_props = {
      className: 'clinical-record-btn',
      style: {display},
      onClick: this.addRecord.bind(this)
    };

    let cancel_btn_props = {
      className: 'clinical-record-btn',
      style: {display}
      //onClick: this.handleSubmit.bind(this)
    }

    let save_btn_props = {
      className: 'clinical-record-btn',
      style: {display}
      //onClick: this.handleSubmit.bind(this)
    };

    return(
      <div className='clinical-record-edit-group'>

        <button {...add_btn_props}>

          <i className='fa fa-plus'></i>
          {' ADD'}
        </button>
        <button {...save_btn_props}>

          <i className='fa fa-ban'></i>
          {' CANCEL'}
        </button>
        <button {...save_btn_props}>

          <i className='fa fa-save'></i>
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
  let project_name = TIMUR_CONFIG.project_name;
  let model_name = `${project_name}_${own_props.attribute.model_name}`;

  /*
   * The main goal of processing the data here is to:
   * 1. Attach the basic defintions to the documents.
   * 2. Nest the documents in their proper hierarchy.
   */

  let dictionary = selectDictionary(state, model_name);
  let documents = selectModelDocuments(state, model_name);
  documents = excludeCheckboxFields(documents);
  documents = interleaveDictionary(documents, dictionary);

  let nested_documents = {};
  if(documents != undefined){
    for(let id in documents){
      nested_documents = nestDataset(
        documents[id],
        nested_documents
      );
    }
  }

  return {
    documents: nested_documents,
    dictionary: dictionary,
    template: selectModelTemplate(state, model_name)
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestDictionaries: (args, project_name)=>{
      dispatch(requestDictionaries(args, project_name));
    },

    reviseDocument: ()=>{
      console.log('sup');
      //dispatch(reviseDocument());
    }
  };
};

export const ClinicalAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ClinicalAttribute);
