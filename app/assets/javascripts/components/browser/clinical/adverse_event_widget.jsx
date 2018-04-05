// Framework libraries.
import * as React from 'react';

// Class imports.
import ClinicalInput from './clinical_input';

export default class AdverseEventWidget extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      term_obj: props.term_obj,
      info_obj: null,
      terms: props.terms,
      values: [],
      info_display: 'none',
      location: {
        x:0,
        y:0
      }
    };
  }

  componentWillReceiveProps(next_props){
    let values = Object.keys(next_props.documents).map((key)=>{
      let ae = next_props.documents[key];
      ae['matches'] = [];
      ae['selected'] = true;
      ae['search_value'] = this.resolveAE(ae.meddra_code);
      return ae;
    });

    if(values.length <= 0) return;
    this.setState({values});
  }

  resolveAE(meddra_code){
    let adverse_events = Object.keys(this.props.term_obj).filter((key)=>{
      return (this.props.term_obj[key].meddra_code == meddra_code);
    });
    return adverse_events[0];
  }

  onSearchChange(index, event){
    let {term_obj, terms} = this.state;
    let values = [...this.state.values];
    let query = event.target.value.toLowerCase();

    values[index].search_value = event.target.value;
    if(query){
      let matches = [];

      terms.forEach( term => {
        if(query.length > 1 && term.toLowerCase().includes(query)){
          matches.push(term);
        }
      });
      values[index].matches = matches;
      values[index].selected = false;
    }
    this.setState({values});
  }

  onInputChange(index, property, event){
    let values = [...this.state.values];
    values[index].inputValue = event.target.value;
    this.setState({values});
  }

  onTermSelect(index, event){
    let sel_val = event.target.attributes.getNamedItem('data-term').value;
    let values = [...this.state.values];
    values[index].search_value = sel_val;
    values[index].matches = [];
    values[index].grade = null;
    values[index].selected = true;
    this.setState({values});
  }

  removeClick(index, event){
    event.preventDefault();
    this.setState((prevState)=>{
      let values = [...prevState.values];
      values.splice(index, 1);
      return {values};
    });
  }

  onInputChange(index, property, event){
    let values = [...this.state.values];
    values[index][property] = event.target.value;
    this.setState({values});
  }

  infoTipShow(event){
    const OFFSET_X = 10;
    const OFFSET_Y = -140;
    const SPACE = '\xa0';
    let {location, term_obj} = this.state;
    let current_location = location;
    let term = event.target.attributes.getNamedItem('data-term').value;
    let info_obj = {
      soc: `SOC: ${SPACE}${term_obj[term]['CTCAE v4.0 SOC']}`,
      def: `DEF: ${SPACE}${term_obj[term]['CTCAE v4.0 AE Term Definition']}`
    }

    let info_height =  Math.round(
      (info_obj.soc.length + info_obj.def.length) / 1.8
    );

    current_location.x = event.pageX + OFFSET_X + 'px';
    current_location.y = event.pageY + OFFSET_Y - info_height + 'px';

    this.setState({
      info_obj, 
      location: current_location,
      info_display: 'block'
    });
  }

  infoTipHide(event){
    this.setState({info_display: 'none'});
  }
  
  optionGrades(term){
    let grades = [];
    let {term_obj} = this.state;

    for(let index = 1; index < 6; index++){
      let grade_string = `${index}: ${term_obj[term]['Grade ' + index]}`;
      grades.push(
        <option key={term+index} value={'Grade '+index}>{grade_string}</option>
      );
    }

    return grades;
  }

  renderSecondaryInputs(index){
    let {values} = this.state;

    let grade_input_props = {
      input_key: index + values[index].search_value,
      input_class_name: 'clinical-grade',
      input_type: 'select',
      input_value: values[index].grade || '',
      select_options: this.optionGrades(values[index].search_value) || '',
      selection_label: 'Grade',
      inputChange: this.onInputChange.bind(this, index, 'grade')
    };

    let start_date_props = {
      input_key: index + values[index].search_value,
      input_class_name: 'clinical-date',
      input_type: 'date',
      input_value: values[index].start_date || '',
      inputChange: this.onInputChange.bind(this, index, 'start_date'),
      selection_label: 'Start Date'
    };

    let end_date_props = {
      input_key: index + values[index].search_value,
      input_class_name: 'clinical-date',
      input_type: 'date',
      input_value: values[index].end_date || '',
      inputChange: this.onInputChange.bind(this, index, 'end_date'),
      selection_label: 'End Date'
    };

    let input_group_props = {
      key: index + values[index].search_value + ' render-inputs',
      className: 'render-inputs'
    };

    return(
      <div {...input_group_props}>

        <ClinicalInput {...grade_input_props} />
        <ClinicalInput {...start_date_props} />
        <ClinicalInput {...end_date_props} />
      </div>
    );
  }

  createInput(){
    let {values, term_obj, info_obj} = this.state;
    let clinical_groups = values.map((elem, index)=>{

      let search_props = {
        input_key: index,
        input_type: 'search',
        input_placeholder: 'Search',
        input_class_name: 'clinical-search',
        input_value: values[index].search_value || '',
        search_options: values[index].matches || [],

        inputChange: this.onSearchChange.bind(this, index),
        onSelectionChange: this.onTermSelect.bind(this, index),
        infoTipShow: this.infoTipShow.bind(this),
        infoTipHide: this.infoTipHide.bind(this)
      };

      return(
        <div className='clinical-group' key={index}>

          <ClinicalInput {...search_props} />
          {values[index].selected && this.renderSecondaryInputs(index)}
          <button className='clinical-button remove' onClick={this.removeClick.bind(this, index)}>

            &#10006;  {/* Remove Cross Symbol */}
          </button>
        </div>
      );
    });

    return clinical_groups;
  }

  addAdverseEvent(event){
    event.preventDefault();
    this.setState(prevState =>
      ({
        values:
          [...prevState.values,
            {
              search_value: '',
              grade: '',
              start_date: '',
              end_date: '',
              matches: [],
              selected: false
            }
          ]
      })
    );
  }

  handleSubmit(event){
    event.preventDefault();
    let submit_values = this.state.values.map((obj => {
      if (obj.search_value && obj.grade && obj.start_date && obj.end_date) {
        return ({
          value: obj.search_value,
          grade: obj.grade,
          start_date: obj.start_date,
          end_date: obj.end_date
        })
      }
    }));
    console.log(submit_values);
  }

  render(){
    let save_btn_props = {
      className: 'clinical-button save',
      onClick: this.handleSubmit.bind(this)
    };
 
    return(
      <div>
        {this.createInput()}
        <button className='clinical-button add' onClick={this.addAdverseEvent.bind(this)}>

          &#10010; ADD
        </button>
        <button {...save_btn_props}>

          {'SAVE'}
        </button>
      </div>
    );
  }
}
