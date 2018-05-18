import * as Reselect from 'reselect';
import * as SelectorUtils from './selector_utils';

const selectDictionary = (state, model_name)=>{

  // Check that the given model has a dictionary defined on it.
  let models = state.magma.models;
  if(!(model_name in models)) return {};
  if(models[model_name].template.dictionary == undefined) return {};

  let dict = models[model_name].template.dictionary;
  let definitions = models[`${dict.project}_${dict.name}`] || {};

  return {
    project: dict.project,
    name: dict.name,
    definitions
  };
};

export const selectDictionaryByNames = Reselect.createSelector(
  selectDictionary,
  (dictionary)=>{

    /* 
     * Remap the dictionary to use the name (rather than the db id) as the key.
     * We want to leave the dictionary in the store unmutated and a close (if
     * not exact copy) of what comes out of the db.
     */
    let new_definitions = {};

    // Condense the definitions by name and concatenate values (if any).
    for(let id in dictionary.definitions){

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

// Use this to sort the table version of the dictinary into a tree.
export const selectNestedDictionary = Reselect.createSelector(
  selectDictionary,
  (dictionary)=>{

    // Set up and start the neseting recursion.
    let nested_denfintions = {};
    if(dictionary.definitions != undefined){
      for(let id in dictionary.definitions){
        let definition = dictionary.definitions[id];
        nested_denfintions = SelectorUtils.nest_dataset(
          definition,
          nested_denfintions
        );
      }
    }

    return {
      project: dictionary.project,
      name: dictionary.name,
      definitions: nested_denfintions
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
