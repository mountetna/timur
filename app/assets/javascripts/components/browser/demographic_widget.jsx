// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

import Magma from '../../magma';
import DemographicInput from './demographic_input';

export class DemographicWidget extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      values: [],
      options: null
    };
  }

  componentWillReceiveProps(next_props){

    let {documents, options} = next_props;
    if(Object.keys(documents).length <= 0) return;

    // Interleave the documents with the dictionary/options.
    let values = [];
    for(let obj in documents){
      values.push({
        selectValue: documents[obj].name.trim(),
        inputValue:documents[obj].value.trim(),
        inputType: options[documents[obj].name].type.trim()
      });
    }

    this.setState({
      values,
      options
    });
  }

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
    let items = [];
    this.state.options[option].value.forEach((el, index)=>{
      items.push(
        <option key={'option-value'+index} value={el}>{el}</option>
      );
    });
    return items;
  }

  createInput(){
    return(
      this.state.values.map((el, index)=>{

        let select_props = {
          className: 'demographic-select',
          onChange: this.handleSelectChange.bind(this, index),
          value: this.state.values[index].selectValue || ''
        };

        let demographics_input_props = null;
        let values = this.state.values;

        if(values[index].selectValue){
          demographics_input_props = {
            input_key: index,
            input_type: values[index].inputType,
            input_value: values[index].inputValue || '',
            select_options: this.optionValues(values[index].selectValue) || '',
            inputChange: this.handleInputChange.bind(this, index)
          }
        }

        let button_props = {
          className: 'demographic-button remove',
          onClick: this.removeClick.bind(this, index)
        };

        return(
          <div className='demographic-group' key={index}>

            <select {...select_props}>

              <option defaultValue=''>

                Make Selection
              </option>
              {this.optionLabels()}
            </select>
            {
              values[index].selectValue &&
              <DemographicInput {...demographics_input_props} />
            }
            <button {...button_props}>

              &#10006;
            </button>
          </div>
        );
      }
    )
  )
 }

  handleSelectChange(index, event){
    let values = [...this.state.values];
    values[index].selectValue = event.target.value;
    values[index].inputValue = '';
    values[index].inputType = this.state.options[values[index].selectValue].type || '';
    this.setState({values});
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

  render(){
    let {record_names} = this.props;
    if (!record_names.length) return <div>No Entries</div>;
 
    let add_btn_props = {
      className: 'demographic-button',
      onClick: this.addClick.bind(this)
    };

    let save_btn_props = {
      className: 'demographic-button',
      onClick: this.handleSubmit.bind(this)
    };

    return(
      <div className='demographic-group'>
        {this.createInput()}

        <button {...add_btn_props}>

          &#10010;{' ADD'}
        </button>
        <button {...save_btn_props}>

          {'SAVE'}
        </button>
      </div>
    );
  }
}

const processCSVData = ()=>{
  let csv = "name,label,value,type,description\nsubject_id,Subject ID,,string,\ninformed_consent,Date Informed Consent Signed,,date,\nfirst_name,First Name,,string,\nlast_name,Last Name,,string,\nmrn,Medical Record Number,,number,\ndate_of_birth,Date Of Birth,,date,\nage,Age (Years),,number,\nsex,Sex,Male,regex,\nsex,Sex,Female,regex,\nethnicity,Ethnicity,Hispanic Or Latino,regex,\nethnicity,Ethnicity,Not Hispanic Or Latino,regex,\nethnicity,Ethnicity,Unknown,regex,\nrace,Race,American Indian Or Alaskan Native,regex,\nrace,Race,Asian,regex,\nrace,Race,Black Or African American,regex,\nrace,Race,Native Hawaiian Or Other Pacific Islander,regex,\nrace,Race,White,regex,\nrace,Race,Unknown,regex,\nrace,Race,Other,regex,\nrace_other,Specify Other,,string,\nheight,Height (cm),,number,\nweight,Weight (kg),,number,\n";
  let lines=csv.trim().split("\n");
  let headers=lines[0].split(",");
  let obj = {};

  for(var i=1;i<lines.length;i++){
    let currentline=lines[i].split(",");
    
    if (obj.hasOwnProperty(currentline[0])) {
      obj[currentline[0]][headers[2]].push(currentline[2]);
    } 
    else {
      obj[currentline[0]] = {};
      obj[currentline[0]][headers[1]]=currentline[1];
      obj[currentline[0]][headers[2]] = [];
      obj[currentline[0]][headers[2]].push(currentline[2]);
      obj[currentline[0]][headers[3]]=currentline[3];
      obj[currentline[0]][headers[4]]=currentline[4];
    }
  }
  return obj;
}

const mapStateToProps = (state, props)=>{
  let magma = new Magma(state);
  let template = magma.template(props.model_name);

  let documents = magma.documents(
    props.model_name,
    props.record_names,
    props.filter
  );

  let options = processCSVData();
  let record_names = Object.keys(documents).sort();

  return {
    options,
    template,
    documents,
    record_names
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {};
};

export const DemographicWidgetContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(DemographicWidget);
