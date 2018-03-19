// Framework libraries.
import * as React from 'react';

export class GenericClinicalAttribute extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      fetched_dictionary: false
    };
  }

  componentDidMount(){
    if(!this.state.fetched_dictionary){
      //fetchDictionary();
      this.setState({fetched_dictionary: true});
    }
  }

  render(){
    return(
      <div>

        {'Generic Clinical Attribute'}
      </div>
    );
  }
}
