// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericClinicalAttribute} from './generic_clinical_attribute';
import AdverseEventWidget from '../../browser/clinical/adverse_event_widget';
import Magma from '../../../magma';

import data from 'json-loader!../../../../data/ctcae_data.json';

// Module imports.
import * as MagmaActions from '../../../actions/magma_actions';

export class AdverseEventAttribute extends GenericClinicalAttribute{
  render(){
    if(this.props.mode != 'browse') return <div className='value'></div>;

    let ae_props = {
      term_obj: this.props.term_obj,
      terms: this.props.terms,
      documents: this.props.documents
    };

    return(
      <div className='value'>

        <AdverseEventWidget {...ae_props} />
      </div>
    );
  }
}

const mapStateToProps = (state, own_props)=>{

  let terms = [];
  let term_obj = Object.assign({}, ...Object.keys(data).map((key)=>{
    terms.push(data[key]['CTCAE v4.0 Term']);
      data[key]['meddra_code'] = key;
    return {
      [data[key]['CTCAE v4.0 Term']]: data[key]
    };
  }));

  let magma = new Magma(state);
  let template = magma.template(own_props.attribute.model_name);

  let documents = magma.documents(
    own_props.attribute.model_name,
    own_props.value,
    own_props.filter
  );

  let record_names = Object.keys(documents).sort();

  return {
    term_obj,
    terms,
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

export const AdverseEventAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(AdverseEventAttribute);
