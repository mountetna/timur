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

    /* 
     * Here we check if the component is in edit mode (we only need the
     * dictionary if we are editing/validating), that there is a named
     * dictionary defined, that there are NO current definitions in our
     * dictionary, and that we have not yet made the request to fetch the
     * dictionary.
     */
    if(
      !this.state.fetched_dictionary &&
      'name' in this.props.dictionary &&
      this.props.mode == 'edit'
    ){
      let {fetchDictionary, dictionary} = this.props;
      fetchDictionary(dictionary.project, dictionary.name);
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
