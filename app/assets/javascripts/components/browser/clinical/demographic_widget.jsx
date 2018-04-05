// Framework libraries.
import * as React from 'react';

// Class imports.
import DemographicInput from './clinical_input';

export default class DemographicWidget extends React.Component{

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
          className: 'clinical-select',
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
      className: 'clinical-button',
      onClick: this.addClick.bind(this)
    };

    let save_btn_props = {
      className: 'clinical-button',
      onClick: this.handleSubmit.bind(this)
    };

    return(
      <div className='clinical-group'>
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
