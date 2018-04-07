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

    // Remap the dictionary to use the name (rather than the db id) as the key.
    let new_definitions = {};
    for(var id in dictionary.definitions){
      let name = dictionary.definitions[id].name;
      new_definitions[name] = dictionary.definitions[id];
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

    /*
    let new_dict = {};
    dictionary.each((definition)=>{

    });
    return new_dict;
    */

    return dictionary;
  }
);
