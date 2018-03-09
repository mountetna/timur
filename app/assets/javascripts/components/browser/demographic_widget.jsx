import { connect } from 'react-redux';
import React from 'react';
import Magma from '../../magma';
import DemographicInput from './demographic_input';

class DemographicWidget extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      values: [],
      options: null
     };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps() {
    this.processDemographicData();
  }

  processDemographicData() {
    let { documents, options} = this.props;
    let values = [];
    for (let obj in documents) {
        values.push({
          selectValue: documents[obj].name.trim(), 
          inputValue:documents[obj].value.trim(),
          inputType: options[documents[obj].name].type.trim()
        });
    }
    this.setState({values, options});
  }

  optionLabels() {
    let items = [];
    Object.keys(this.state.options).forEach( (key,i) => {
      items.push(
        <option key={i} value={key}>{this.state.options[key].label}</option>
      ); 
    });
    return items;
  }

  optionValues(option) {
    let items = [];
    this.state.options[option].value.forEach( (el,i) => {
      items.push(<option key={'option-value' + i} value={el}>{el}</option>);
    });
    return items;
  }

  createInput() {
    return(
      this.state.values.map((el, i) => {

        let select_props = {
          className: 'demographic-select',
          onChange: this.handleSelectChange.bind(this, i),
          value: this.state.values[i].selectValue || ''
        };

        let demographics_input_props = null;
        if (this.state.values[i].selectValue) {
          demographics_input_props = {
            inputKey: i,
            inputType: this.state.values[i].inputType,
            inputValue: this.state.values[i].inputValue || '',
            inputChange: this.handleInputChange.bind(this, i),
            selectOptions: this.optionValues(this.state.values[i].selectValue) || '' 
          }
        }

        return (<div key={i}>

          <select {...select_props}>

            <option defaultvalue=''>Make Selection</option>
            {this.optionLabels()}
          </select>

          {
            this.state.values[i].selectValue && 
              <DemographicInput {...demographics_input_props}/>
          }

          {
            !this.state.values[i].selectValue && 
              <input className='demographic-input hide'/>
          }

          <button
            className='demographic-button remove'
            onClick={this.removeClick.bind(this, i)}>
            
            <i className='fa fa-times' aria-hidden='true'></i> REMOVE
          </button>
        </div>)
      }
    )
  )
 }

  handleSelectChange(i, event) {
    let values = [...this.state.values];
    values[i].selectValue = event.target.value;
    values[i].inputValue = '';
    values[i].inputType = this.state.options[values[i].selectValue].type || '';
    this.setState({ values });
 }

  handleInputChange(i, event) {
    let values = [...this.state.values];
    values[i].inputValue = event.target.value;
    this.setState({ values });
  }
 
  addClick(event){
    event.preventDefault();
    this.setState(prevState =>
      ({ 
        values: 
          [...prevState.values, {selectValue: '', inputValue: '', inputType: ''}]
      })
    )
  }

  removeClick(i, event){
    event.preventDefault();
    this.setState(prevState => {
      let values = [...prevState.values];
      values.splice(i, 1);
      return {values: values};
    });
  }

  handleSubmit(event) {
    alert('Testing: ' + this.state.values.join(', '));
    event.preventDefault();
  }

  render() {
    let { record_names } = this.props;
    if (!record_names.length) return <div>No Entries</div>;
 
    return(
      <form onSubmit={this.handleSubmit}>
        {this.createInput()}

      <button
        className='demographic-button'
        onClick={this.addClick.bind(this)}> 
  
        <i className='fa fa-plus' aria-hidden='true'></i> ADD 
      </button>
      <input className='demographic-button' type="submit" value="SAVE"/>
    </form>
    );
  }
}

const   processCSVData = () => {
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
  let documents = magma.documents(props.model_name, props.record_names, props.filter);
  let options = processCSVData();
  let record_names = Object.keys(documents).sort();
  return { options, template, documents, record_names };
};

export default connect( mapStateToProps,{ })(DemographicWidget);
