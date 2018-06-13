import * as Reselect from 'reselect';

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
    return ('documents' in model) ? Object.assign({}, model.documents) : {};
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

export const selectModelRevisions = Reselect.createSelector(
  selectModel,
  (model)=>{
    return ('revisions' in model) ? model.revisions : {};
  }
);

export const selectModelRevision = Reselect.createSelector(
  selectModelRevisions,
  setRecordName,
  (revisions, record_name)=>{
    return (record_name in revisions) ? revisions[record_name] : {};
  }
);

// Select the model all the names from all of the models.
export const selectModelNames = Reselect.createSelector(
  selectModels,
  (models)=>{
    return Object.keys(models).sort();
  }
);

// Select all the templates for all the models.
export const selectModelTemplates = Reselect.createSelector(
  selectModels,
  (models)=>{
    return Object.keys(models).map((model_name)=>{
      return models[model_name].template;
    });
  }
);

// Select the template for a model.
export const selectModelTemplate = Reselect.createSelector(
  selectModel,
  (model)=>{
    return ('template' in model) ? model.template : null;
  }
);
