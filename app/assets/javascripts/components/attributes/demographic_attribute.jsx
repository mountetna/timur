import React from 'react';
import {DemographicWidgetContainer} from '../browser/demographic_widget';

export default class DemographicAttribute extends React.Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    if(this.props.mode != 'browse') return <div className='value'></div>;

    let demo_props = {
      model_name: this.props.attribute.model_name,
      record_names: this.props.value
    };

    return(
      <div className='value'>

        <DemographicWidgetContainer {...demo_props} />
      </div>
    );
  }
}
