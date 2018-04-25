// Framework libraries.
import * as React from 'react';

export class GenericClinicalAttribute extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      fetched_dictionary: false
    };
  }

  componentDidUpdate(){
    // Check for a dictionary to fetch that corresponds to a model/component.
    if(
      this.state.fetched_dictionary ||
      !('dictionary' in this.props) ||
      !('name' in this.props.dictionary) ||
      this.props.dictionary.name == undefined
    ) return;

    this.props.fetchDictionary(
      this.props.dictionary.project,
      this.props.dictionary.name
    );
    this.setState({fetched_dictionary: true});
  }

  render(){
    return(
      <div>

        {'Generic Clinical Attribute'}
      </div>
    );
  }
}
