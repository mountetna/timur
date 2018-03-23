import React from 'react';
import ClinicalInput from './clinical_input';

export default class AdverseEventsWidget extends React.Component{
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

  onSearchChange(index, event){
    let {term_obj, terms} = this.state;
    let values = [...this.state.values];
    let query = event.target.value.toLowerCase();

    values[index].searchValue = event.target.value;
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
    let selectionVal = event.target.attributes.getNamedItem('data-term').value;
    let values = [...this.state.values];
    values[index].searchValue = selectionVal;
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

  createInput(){
    let {values, term_obj, info_obj} = this.state;

    return(
      values.map((el, index)=>{
        let grade_input_props = null;
        let start_date_props = null;
        let end_date_props = null;
        let renderInputs = null;
        
        let search_props = {
          input_key: index,
          input_type: 'search',
          input_placeholder: 'Search',
          input_class_name: 'clinical-search',
          inputChange: this.onSearchChange.bind(this, index),
          input_value: values[index].searchValue || '',
          search_options: values[index].matches || [],
          onSelectionChange: this.onTermSelect.bind(this, index),
          infoTipShow: this.infoTipShow.bind(this),
          infoTipHide: this.infoTipHide.bind(this)
        };

        let style_props = {
          display: this.state.info_display,
          left: this.state.location.x || 0,
          top: this.state.location.y || 0
        }

        let info_tip_props = {
          key: index+'info',
          className: 'info-tip',
          style: style_props
        }

        let renderInfoTip = () => {
          return ( 
            <div {...info_tip_props}>
              {
                Object.keys(info_obj).map((obj_key, index)=>{
                  return(
                    <div key={i+info_obj[obj_key]}>

                      {info_obj[obj_key]}<br /><br />
                    </div>
                  )
                })
              }
            </div>
          );
        };

        if(values[index].selected){
          grade_input_props = {
            input_key: index + values[index].searchValue,
            input_class_name: 'clinical-grade',
            input_type: 'select',
            input_value: values[index].grade || '',
            inputChange: this.onInputChange.bind(this, index, 'grade'),
            select_options: this.optionGrades(values[index].searchValue) || '',
            selection_label: 'Grade'
          };

          start_date_props = {
            input_key: index + values[index].searchValue,
            input_class_name: 'clinical-date',
            input_type: 'date',
            input_value: values[index].start_date || '',
            inputChange: this.onInputChange.bind(this, index, 'start_date'),
            selection_label: 'Start Date'
          };

          end_date_props = {
            input_key: index + values[index].searchValue,
            input_class_name: 'clinical-date',
            input_type: 'date',
            input_value: values[index].end_date || '',
            inputChange: this.onInputChange.bind(this, index, 'end_date'),
            selection_label: 'End Date'
          };
        
          renderInputs = ()=>{
            let renderInput_props = {
              key: index + values[index].searchValue + ' render-inputs',
              className: 'render-inputs'
            };

            return (
              <div {...renderInput_props}>

                <ClinicalInput {...grade_input_props} />
                <ClinicalInput {...start_date_props} />
                <ClinicalInput {...end_date_props} />
              </div>
            );
          };
        }

        return (
          <div className='clinical-group' key={index}>

            <ClinicalInput {...search_props} />
            {info_obj && renderInfoTip()}
            {values[index].selected && renderInputs()}
            <button
              className='clinical-button remove'
              onClick={this.removeClick.bind(this, index)}>
             
              &#10006;  {/* Remove Cross Symbol */}
            </button>
          </div>
        );
      })
    );
  }

  addClick(event){
    event.preventDefault();
    this.setState(prevState =>
      ({ 
        values: 
          [...prevState.values,
            {
              searchValue: '',
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
      if (obj.searchValue && obj.grade && obj.start_date && obj.end_date) {
        return ({
          value: obj.searchValue,
          grade: obj.grade,
          start_date: obj.start_date,
          end_date: obj.end_date
        })
      }
    }));
    console.log(submit_values);
  }

  render() {
    let save_btn_props = {
      className: 'clinical-button save',
      onClick: this.handleSubmit.bind(this)
    };
 
    return(
      <form>
        {this.createInput()}

        <button
          className='clinical-button add'
          onClick={this.addClick.bind(this)}>

          &#10010; ADD
        </button>
        <button {...save_btn_props}>

          {'SAVE'}
        </button>
      </form>
    );
  }
}
