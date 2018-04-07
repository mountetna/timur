// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import {GenericClinicalAttribute} from './generic_clinical_attribute';
import DemographicWidget from '../../browser/clinical/demographic_widget';
import Magma from '../../../magma';
import * as DictionarySelector from '../../../selectors/dictionary_selector';

// Module imports.
import * as MagmaActions from '../../../actions/magma_actions';

export class DemographicAttribute extends GenericClinicalAttribute{
  render(){
    return(
      <div className='value'>

        <DemographicWidget {...this.props} />
      </div>
    );
  }
}

const processCSVData = ()=>{
  let csv = "name,label,value,type,description\nsubject_id,Subject ID,,string,\ninformed_consent,Date Informed Consent Signed,,date,\nfirst_name,First Name,,string,\nlast_name,Last Name,,string,\nmrn,Medical Record Number,,number,\ndate_of_birth,Date Of Birth,,date,\nage,Age (Years),,number,\nsex,Sex,Male,regex,\nsex,Sex,Female,regex,\nethnicity,Ethnicity,Hispanic Or Latino,regex,\nethnicity,Ethnicity,Not Hispanic Or Latino,regex,\nethnicity,Ethnicity,Unknown,regex,\nrace,Race,American Indian Or Alaskan Native,regex,\nrace,Race,Asian,regex,\nrace,Race,Black Or African American,regex,\nrace,Race,Native Hawaiian Or Other Pacific Islander,regex,\nrace,Race,White,regex,\nrace,Race,Unknown,regex,\nrace,Race,Other,regex,\nrace_other,Specify Other,,string,\nheight,Height (cm),,number,\nweight,Weight (kg),,number,\n";
  let lines=csv.trim().split("\n");
  let headers=lines[0].split(",");
  let obj = {};

  for(var i=1;i<lines.length;i++){
    let currentline=lines[i].split(",");
    
    if (obj.hasOwnProperty(currentline[0])) {
      obj[currentline[0]][headers[2]].push(currentline[2]);
    } 
    else {
      obj[currentline[0]] = {};
      obj[currentline[0]][headers[1]]=currentline[1];
      obj[currentline[0]][headers[2]] = [];
      obj[currentline[0]][headers[2]].push(currentline[2]);
      obj[currentline[0]][headers[3]]=currentline[3];
      obj[currentline[0]][headers[4]]=currentline[4];
    }
  }
  return obj;
}

const mapStateToProps = (state, own_props)=>{

/*
  let dictionary = new DictionarySelector(
    state,
    own_props.attribute.model_name
  );
*/

  let magma = new Magma(state);
  let template = magma.template(own_props.attribute.model_name);
  let documents = magma.documents(
    own_props.attribute.model_name,
    own_props.value,
    own_props.filter
  );

  //let options = processCSVData();
  let dictionary = DictionarySelector.selectDemograhicDictionary(
    state,
    own_props.attribute.model_name
  );

  let record_names = Object.keys(documents).sort();

  return {
    //options: dictionary.definitions,
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

export const DemographicAttributeContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(DemographicAttribute);
