import * as Reselect from 'reselect';

export default class DictionarySelector{
  constructor(state, model_name){
    let models = state.magma.models;
    if(!(model_name in models)) return {};
    if(models[model_name].template.dictionary == undefined) return {};

    /*
     * Clone the template data object, which contains the reference to the
     * the correct dictionary.
     */
    let dict = Object.assign({}, models[model_name].template.dictionary);

    /*
     * If the dictionary is in the store then we pass reference to it. This data
     * should not be mutated and is used as a reference. So passing as reference
     * instead of cloning is acceptable.
     */
    dict['definitions'] = state.dictionary[`${dict.project}_${dict.name}`];
    if(dict.definitions == undefined) delete dict.definitions;

    return dict;
  }
}

export const selectDictionary = (state, model_name)=>{

  // Check that the given model has a dictionary defined on it.
  let models = state.magma.models;
  if(!(model_name in models)) return {};
  if(models[model_name].template.dictionary == undefined) return {};

  let dict = models[model_name].template.dictionary;
  let definitions = state.dictionary[`${dict.project}_${dict.name}`] || {};

  return {
    project: dict.project,
    name: dict.name,
    definitions
  };
};

export const selectDemograhicDictionary = Reselect.createSelector(
  selectDictionary,
  (dictionary)=>{

    /* 
     * Remap the dictionary to use the name (rather than the db id) as the key.
     * We want to leave the dictionary in the store unmutated and close (if not
     * and exact copy) of what comes out of the db.
     */
    let new_definitions = {};

    // Condense the definitions by name and concatenate values (if any).
    for(var id in dictionary.definitions){

      let name = dictionary.definitions[id].name;
      if(!(name in new_definitions)){
        new_definitions[name] = Object.assign({}, dictionary.definitions[id]);
        new_definitions[name]['value'] = [];
      }

      if(dictionary.definitions[id].type == 'regex'){
        new_definitions[name].value.push(dictionary.definitions[id].value);
      }
      else{
        new_definitions[name]['value'] = [''];
      }
    }

    return {
      project: dictionary.project,
      name: dictionary.name,
      definitions: new_definitions
    };
  }
);

export const selectAdverseEventDictionary = Reselect.createSelector(
  selectDictionary,
  (dictionary)=>{

    // Resort the dictionary by CTCAE Term.
    let new_definitions = {};
    let terms = [];
    for(var id in dictionary.definitions){
      let definition = Object.assign({}, dictionary.definitions[id]);
      let term = definition.term;
      terms.push(term);
      new_definitions[term] = definition;

      // Condense the grade as well.
      new_definitions[term]['grade'] = [];
      new_definitions[term]['grade'].push(definition['grade_one']);
      new_definitions[term]['grade'].push(definition['grade_two']);
      new_definitions[term]['grade'].push(definition['grade_three']);
      new_definitions[term]['grade'].push(definition['grade_four']);
      new_definitions[term]['grade'].push(definition['grade_five']);
    }

    return {
      project: dictionary.project,
      name: dictionary.name,
      definitions: new_definitions,
      terms
    };
  }
);
