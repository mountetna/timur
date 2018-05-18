import * as Reselect from 'reselect';
import * as SelectorUtils from './selector_utils';

const selectModel = (state, model_name)=>{
  if(!('models' in state.magma)) return {};
  if(!(model_name in state.magma.models)) return {};
  return state.magma.models[model_name];
};

const selectModels = (state)=>{
  return (state.magma.models != undefined) ? state.magma.models : {};
};

// This function serves as an extention to the argument list of 'selectModel'.
const setRecordName = (state, model_name, record_name)=>{
  return (record_name != undefined || record_name != null) ? record_name : '';
};

// Select all documents for a model.
export const selectModelDocuments = Reselect.createSelector(
  selectModel,
  (model)=>{
    return ('documents' in model) ? model.documents : {};
  }
);

// Select a single document from a group of models of the same type.
export const selectModelDocument = Reselect.createSelector(
  selectModelDocuments,
  setRecordName,
  (documents, record_name)=>{
    return (record_name in documents) ? documents[record_name] : {};
  }
);

// Select all documents, for a model, in a nested format.
export const selectNestedDocuments = Reselect.createSelector(
  selectModelDocuments,
  (documents)=>{

    // Set up and start the nesting recursion.
    let nested_documents = {};
    if(documents != undefined){
      for(let id in documents){
        nested_documents = SelectorUtils.nestDataset(
          documents[id],
          nested_documents
        );
      }
    }

    return nested_documents;
  }
);

// Select the template for a model.
export const selectModelTemplate = Reselect.createSelector(
  selectModel,
  (model)=>{
    return ('template' in model) ? model.template : {};
  }
);

// Select the revisions for a model.
export const selectModelRevisions = Reselect.createSelector(
  selectModel,
  (model)=>{
    return ('revisions' in model) ? model.revisions : {};
  }
);

// Select the model all the names from all of the models.
export const selectModelNames = Reselect.createSelector(
  selectModels,
  (models)=>{
    return Object.keys(models).sort();
  }
);
