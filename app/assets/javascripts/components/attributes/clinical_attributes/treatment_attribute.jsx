// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericClinicalAttribute} from './generic_clinical_attribute';
import DemographicWidget from '../../browser/clinical/demographic_widget';
import Magma from '../../../magma';

// Module imports.
import * as MagmaActions from '../../../actions/magma_actions';
import * as DictionarySelector from '../../../selectors/dictionary_selector';

export class TreatmentAttribute extends GenericClinicalAttribute{
  render(){
    if(this.props.mode != 'browse') return <div className='value'></div>;

    return(
      <div className='value'>

        <DemographicWidget {...this.props} />
      </div>
    );
  }
}

const mapStateToProps = (state, own_props)=>{
  let magma = new Magma(state);
  let template = magma.template(own_props.attribute.model_name);

  let documents = magma.documents(
    own_props.attribute.model_name,
    own_props.value,
    own_props.filter
  );

  let dictionary = DictionarySelector.selectDemograhicDictionary(
    state,
    own_props.attribute.model_name
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
    fetchDictionary: (project_name, dict_name)=>{
      dispatch(MagmaActions.requestDictionaries(project_name, dict_name));
    }
  };
};

export const TreatmentAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(TreatmentAttribute);
