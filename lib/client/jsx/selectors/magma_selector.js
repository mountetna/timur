import * as Reselect from 'reselect';

const selectModel = (state, model_name)=>{
  if(!(models in state.magma)) return {};
  if(!(model_name in state.magma.models)) return {};
  return state.magma.models[model_name][record_name];
};

const selectModels = (state)=>{
  return (state.magma.models != undefined) ? state.magma.models : {};
};

export const selectModelDocuments = Reselect.createSelector(
  selectModel,
  (model)=>{
    return (documents in model) ? model.documents : {};
  }
);

export const selectModelTemplate = Reselect.createSelector(
  selectModel,
  (model)=>{
    return (template in model) ? model.template : {};
  }
);

export const selectModelRevisions = Reselect.createSelector(
  selectModel,
  (model)=>{
    return (revisions in model) ? model.revisions : {};
  }
);

export const selectModelNames = Reselect.createSelector(
  selectModels,
  (models)=>{
    return Object.keys(models).sort();
  }
);
