// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import * as MagmaSelector from '../../selectors/magma_selector';
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
  let project_name = TIMUR_CONFIG.project_name;
  let model_name = `${project_name}_${own_props.attribute.model_name}`;

/*
  let dictionary = DictionarySelector.selectDictionaryByNames(
    state,
    model_name
  );

  let template = MagmaSelector.selectModelTemplate(
    state,
    model_name
  );

  let documents = MagmaSelector.selectModelDocuments(
    state,
    model_name
  );

  let nested_documents = MagmaSelector.selectNestedDocuments(
    state,
    model_name
  );

  let nested_dictionary = DictionarySelector.selectNestedDictionary(
    state,
    model_name
  );
*/

  let documents = MagmaSelector.selectModelDocuments(state, model_name);

  return {
    documents,
    template: MagmaSelector.selectModelTemplate(state, model_name),
    record_names: Object.keys(documents).sort(),
    dictionary: DictionarySelector.selectDictionaryByNames(state, model_name)
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
