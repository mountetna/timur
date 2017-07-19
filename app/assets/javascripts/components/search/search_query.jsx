import React, {Component} from 'react';
import Selector from '../selector';

export default class SearchQuery extends Component{

  constructor(props){
    super(props);
    this['state'] = {};
  }

  render(){

    var selector_props = {
      'name': 'model',
      'values': this.props.model_names,
      'onChange': (model_name)=>{
        this.setState({'selected_model': model_name});
      },
      'showNone': 'enabled'
    };

    var filter_input_props = {
      'type': 'text',
      'className': 'filter',
      'placeholder': 'filter query',
      'onChange': (e)=>{
        this.setState({'current_filter': e.target.value})
      }
    };

    var button_input_props = {

      'type': 'button',
      'className': 'button',
      'value': 'Search',
      'disabled': !this.state.selected_model,
      'onClick': ()=>{
        this.props.postQuery(this.state.selected_model, this.state.current_filter);
      }
    };

    return(
      <div className='query'>

        <span className='label'>

          {'Show table'}
        </span>
        <Selector {...selector_props} />
        <input {...filter_input_props} />
        <input {...button_input_props} />
      </div>
    );
  }
}