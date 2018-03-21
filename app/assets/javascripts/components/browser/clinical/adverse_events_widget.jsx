import React from 'react';
import data from 'json-loader!../../../../data/ctcae_data.json';
import SearchBar from '../../search_bar';
import DemographicInput from './demographic_input';

export default class AdverseEventsWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term_obj: null,
      info_obj: null,
      terms: [],
      values: [],
      info_display: 'none',
      location: {
        x:0,
        y:0
      }
    };
  }

  componentDidMount() {
    this.processJSONData();
  }

  processJSONData() {
    let term_obj= null;
    let terms = [];
    term_obj = Object.assign({}, ...Object.keys(data).
      map(key => {
        terms.push(data[key]['CTCAE v4.0 Term']);
        return {[data[key]['CTCAE v4.0 Term']]: data[key]}
        } 
      )
    )
    this.setState({term_obj, terms});
  }

  onSearchChange(i, event) {

    let {term_obj, terms} = this.state;
    let values = [...this.state.values];
    let query = event.target.value.toLowerCase();

    values[i].searchValue = event.target.value;
    if(query){
      let matches = [];

      terms.forEach( term => {
        if(query.length > 1 && term.toLowerCase().includes(query)) {
          matches.push(term);
        }
      });
      values[i].matches = matches;
      values[i].data_collection_ui = false;
    }
    this.setState({values});
  }

  onInputChange(index, property, event){
    let values = [...this.state.values];
    values[index].inputValue = event.target.value;
    this.setState({values});
  }

  onTermSelect(i, event){
    let selectionVal = event.target.attributes.getNamedItem('data-term').value
    let values = [...this.state.values];
    values[i].searchValue = selectionVal;
    values[i].matches = [];
    values[i].grade = null;
    values[i].data_collection_ui = true;
    this.setState({values});    
  }

  removeClick(i, event){
    event.preventDefault();
    this.setState(prevState => {
      let values = [...prevState.values];
      values.splice(i, 1);
      return {values};
    });
  }

  onInputChange(i, property, event) {
    let values = [...this.state.values];
    values[i][property] = event.target.value;
    this.setState({ values });
  }

  infoTipShow(event){
    const OFFSET_X = 10;
    const OFFSET_Y = -200;
    const SPACE = '\xa0';
    let {location, term_obj} = this.state;
    let current_location = location;
    let term = event.target.attributes.getNamedItem('data-term').value;
    let info_obj = {
      soc: `SOC: ${SPACE}${term_obj[term]['CTCAE v4.0 SOC']}`,
      def: `DEF: ${SPACE}${term_obj[term]['CTCAE v4.0 AE Term Definition']}`
    }

    let info_height =  Math.ceil(
      (info_obj.soc.length + info_obj.def.length) / 1.8
    );

    current_location.x = event.pageX + OFFSET_X;
    current_location.y = event.pageY + OFFSET_Y - info_height;

    this.setState({
      info_obj, 
      location: current_location,
      info_display: 'block'
    });
  }

  infoTipHide(event){
    this.setState({info_display: 'none'});
  }
  
  optionGrades(term) {
    let grades = [];
    let {term_obj} = this.state;

    for(let i=1; i <6; i++) {
      let grade_string = `${i}: ${term_obj[term]['Grade ' + i]}`;
      grades.push(
        <option key={term+ i} value={'Grade ' + i}>{grade_string}</option>
      );
    }
    return grades
  }

  createInput(){
    let {values, term_obj, info_obj} = this.state;

    return(
      values.map((el, i) => {
        let grade_input_props = null;
        let start_date_props = null;
        let end_date_props = null;
        let renderInputs = null;
        
        let input_props = {
          input_type: 'text',
          input_placeholder: 'Search',
          input_class_name: 'adverse-events-search',
          inputChange: this.onSearchChange.bind(this, i),
          input_value: values[i].searchValue || '',
          input_options: values[i].matches || [],
          info_obj: term_obj,
          search_bar_index: i,
          onSelectionChange: this.onTermSelect.bind(this,  i),
          infoTipShow: this.infoTipShow.bind(this),
          infoTipHide: this.infoTipHide.bind(this)
        };

        let style_props = {
          display: this.state.info_display,
          left: this.state.location.x || 0,
          top: this.state.location.y || 0
        }

        let info_tip_props = {
          key: i+'info',
          className: 'info-tip',
          style: style_props
        }

        let renderInfoTip = () => {
          return ( 
            <div {...info_tip_props}>
              {
                Object.keys(info_obj).map((obj_key, i)=>{
                  return(
                    <div key={i+info_obj[obj_key]}>

                      {info_obj[obj_key]}<br/><br/>
                    </div>
                  )
                })
              }
            </div>
          )
        }

        if(values[i].data_collection_ui) {
          grade_input_props = {
            input_key: i + values[i].searchValue,
            input_class_name: 'adverse-events-grade',
            input_type: 'select',
            input_value: values[i].grade || '',
            inputChange: this.onInputChange.bind(this, i, 'grade'),
            select_options: this.optionGrades(values[i].searchValue) || '',
            selection_label: 'Grade'
          }

          start_date_props = {
            input_key: i + values[i].searchValue,
            input_class_name: 'adverse-events-date',
            input_type: 'date',
            input_value: values[i].start_date || '',
            inputChange: this.onInputChange.bind(this, i, 'start_date'),
            selection_label: 'Start Date'
          }

          end_date_props = {
            input_key: i + values[i].searchValue,
            input_class_name: 'adverse-events-date',
            input_type: 'date',
            input_value: values[i].end_date || '',
            inputChange: this.onInputChange.bind(this, i, 'end_date'),
            selection_label: 'End Date'
          }
        
          renderInputs = () => {
            let renderInput_props = {
              key: i + values[i].searchValue + ' render-inputs',
              className: 'render-inputs'
            }
            return (
              <div {...renderInput_props}>
                <DemographicInput {...grade_input_props}/>
                <DemographicInput {...start_date_props}/>
                <DemographicInput {...end_date_props}/>
              </div>
            )
          }
        }

        return (
          <div className='adverse-event-group' key={i}>

            <SearchBar {...input_props}/>

            {this.state.info_obj && renderInfoTip()}

            {values[i].data_collection_ui && renderInputs()}

            <button
              className='adverse-event-button remove'
              onClick={this.removeClick.bind(this, i)}>
             
              &#10006;  {/* Remove Cross Symbole */}
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
              data_collection_ui: false
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
      className: 'adverse-events-button save',
      onClick: this.handleSubmit.bind(this)
    };
 
    return(
      <form>
        {this.createInput()}

        <button
          className='adverse-events-button add'
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