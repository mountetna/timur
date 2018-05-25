// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import ClinicalInput from '../inputs/clinical_input';

// Module imports.
import {
  requestDictionaries
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
  compressCheckboxFields
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

//  UNSAFE_componentWillReceiveProps(next_props){
//
//    let {documents, dictionary} = next_props;
//    if(
//      Object.keys(documents).length <= 0 ||
//      Object.keys(dictionary).length <= 0
//    ) return;
//
///*
//    // Interleave the documents with the dictionary/options.
//    let values = [];
//    for(let obj in documents){
//
//      // This can be removed once we have all of the fields in the dictionary.
//      if(documents[obj].name == undefined){
//        console.log(documents[obj].names);
//      }
//
//      if(documents[obj].name in options){
//        values.push({
//          selectValue: documents[obj].name.trim(),
//          inputValue:documents[obj].value.trim(),
//          inputType: options[documents[obj].name].type.trim()
//        });
//      }
//    }
//*/
//
//    this.setState({
//      documents,
//      dictionary
//    });
//  }

/*
  optionLabels(){
    let items = [];
    Object.keys(this.state.options).forEach((key, index)=>{
      items.push(
        <option key={index} value={key}>{this.state.options[key].label}</option>
      ); 
    });
    return items;
  }

  optionValues(option){
    if(!this.state.options[option]) return null;

    let items = [];
    this.state.options[option].value.forEach((el, index)=>{
      items.push(
        <option key={'option-value'+index} value={el}>{el}</option>
      );
    });
    return items;
  }


  handleSelectChange(index, event){
    let {values, options} = this.state;
    let vals = [...values];
    vals[index].selectValue = event.target.value;
    vals[index].inputValue = '';
    vals[index].inputType = options[values[index].selectValue].type || '';
    this.setState({vals});
  }

  handleInputChange(index, event){
    let values = [...this.state.values];
    values[index].inputValue = event.target.value;
    this.setState({values});
  }
 
  addClick(event){
    event.preventDefault();
    this.setState((prev_state)=>{
      return {
        values: [
          ...prev_state.values,
          {selectValue: '', inputValue: '', inputType: ''}
        ]
      };
    });
  }

  removeClick(index, event){
    event.preventDefault();
    this.setState((prev_state)=>{
      let values = [...prev_state.values];
      values.splice(index, 1);
      return {values: values};
    });
  }

  handleSubmit(event){
    console.log(this.state.values);
    event.preventDefault();
  }

  createInput(){
    return this.state.values.map((el, index)=>{

      let select_props = {
        className: 'clinical-select',
        onChange: this.handleSelectChange.bind(this, index),
        value: this.state.values[index].selectValue || ''
      };

      let clinical_input_props = null;
      let values = this.state.values;

      if(values[index].selectValue){
        clinical_input_props = {
          input_key: index,
          input_type: values[index].inputType,
          input_value: values[index].inputValue || '',
          select_options: this.optionValues(values[index].selectValue) || '',
          inputChange: this.handleInputChange.bind(this, index)
        };
      }

      let button_props = {
        className: 'clinical-button remove',
        onClick: this.removeClick.bind(this, index)
      };

      return(
        <div className='clinical-group' key={index}>

          <select {...select_props}>

            <option defaultValue=''>

              Make Selection
            </option>
            {this.optionLabels()}
          </select>
          {
            values[index].selectValue &&
            <ClinicalInput {...clinical_input_props} />
          }
          <button {...button_props}>

            &#10006;
          </button>
        </div>
      );
    });
  }

  // Recurse over the nested dictionary and extract the appropriate definitions.
  selectDefinitions(name, definitions, dictionary){

    for(let id in dictionary){
      if(dictionary[id].name == name){
        definitions[id] = dictionary[id];
      }

      if('children' in dictionary[id]){
        definitions = this.selectDefinitions(
          name,
          definitions,
          dictionary[id].children
        );
      }
    }

    return definitions;
  }
*/
  renderInput(record){
    let input_props = {
      className: 'clinical-input',
      value: record.value,
      disabled: 'disabled',
      key: `input_${record.type}_${record.id}`,
      onChange: (event)=>{
        console.log(event);
      }
    };

    switch(record.type){
      case 'string':
        input_props['type'] = 'text';
        return <input {...input_props} />;
      case 'textarea':
        input_props['type'] = 'textarea';
        return <input {...input_props} />;
      case 'number':
        input_props['type'] = 'number';
        return <input {...input_props} />;
      case 'date':
        input_props['type'] = 'date';
        return <input {...input_props} />;
      case 'regex':
      case 'dropdown':
      case 'select':
        if(record.definitions == undefined) return null;
        if(record.definitions.values == undefined) return null;
        return(
          <select {...input_props}>

            {record.definitions.values.map((val)=>{
              return(
                <option key={Math.random()} value={val}>

                  {val}
                </option>
              );
            })}
          </select>
        );
    }

    return <div>{'sup'}</div>;
  }

  renderRecord(record){
    let child_elements = [];
    for(let id in record.children){
      child_elements.push(this.renderRecord(record.children[id]));
    }

    return(
      <div className='clinical-record-group' key={`record_${record.id}`}>

        <div className='clinical-record-key' data-name={record.name}>

          {record.label}
        </div>
        <ClinicalInput record={record} />
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
    for(let id in documents) elements.push(this.renderRecord(documents[id]));
    return elements;
  }

  renderEditButtons(){
    if(this.props.mode != 'edit') return null;

    let add_btn_props = {
      className: 'clinical-button',
      onClick: this.addClick.bind(this)
    };

    let save_btn_props = {
      className: 'clinical-button',
      onClick: this.handleSubmit.bind(this)
    };

    return(
      <div>

        <button {...add_btn_props}>

          &#10010;{' ADD'}
        </button>
        <button {...save_btn_props}>

          {'SAVE'}
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

  let documents = selectModelDocuments(state, model_name);

  documents = compressCheckboxFields(documents);

  documents = interleaveDictionary(
    documents,
    selectDictionary(state, model_name)
  );

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
    dictionary: selectNestedDictionary(state, model_name),
    template: selectModelTemplate(state, model_name)
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    requestDictionaries: (args, project_name)=>{
      dispatch(requestDictionaries(args, project_name));
    }
  };
};

export const ClinicalAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ClinicalAttribute);
