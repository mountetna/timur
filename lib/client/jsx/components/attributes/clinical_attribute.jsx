// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import Magma from '../../magma';
import * as DictionarySelector from '../../selectors/dictionary_selector';

// Module imports.
import * as MagmaActions from '../../actions/magma_actions';

export class ClinicalAttribute extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      fetched_dictionary: false
    };
  }

  componentDidUpdate(){

    let {dictionary, fetchDictionary} = this.props;

    // Check for a dictionary to fetch that corresponds to a model/component.
    if(
      this.state.fetched_dictionary ||
      !('dictionary' in this.props) ||
      !('name' in dictionary) ||
      dictionary.name == undefined
    ) return;

    fetchDictionary({dictionary_name: dictionary.name}, dictionary.project);
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

const mapStateToProps = (state, own_props)=>{
  let model_name = `${TIMUR_CONFIG.project_name}_${own_props.attribute.model_name}`;
  let magma = new Magma(state);
  let template = magma.template(model_name);
  let documents = magma.documents(
    model_name,
    own_props.value,
    own_props.filter
  );

  let dictionary = DictionarySelector.selectDemograhicDictionary(
    state,
    model_name
  );

  let record_names = Object.keys(documents).sort();

  return {
    template,
    documents,
    record_names,
    dictionary
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchDictionary: (args, project_name)=>{
      dispatch(MagmaActions.requestDictionaries(args, project_name));
    }
  };
};

export const ClinicalAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ClinicalAttribute);
