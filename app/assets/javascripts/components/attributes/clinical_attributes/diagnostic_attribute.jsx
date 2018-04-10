// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericClinicalAttribute} from './generic_clinical_attribute';
import DemographicWidget from '../../browser/clinical/demographic_widget';
import Magma from '../../../magma';

// Module imports.
import * as MagmaActions from '../../../actions/magma_actions';

export class DiagnosticAttribute extends GenericClinicalAttribute{
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

  let record_names = Object.keys(documents).sort();

  return {
    options: {},
    template,
    documents,
    record_names
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    fetchDictionary: (dictionary_names)=>{
      dispatch(MagmaActions.requestDictionaries(dictionary_names));
    }
  };
};

export const DiagnosticAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(DiagnosticAttribute);
