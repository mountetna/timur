import * as Reselect from 'reselect';

export const selectModelNames = (state) => Object.keys(state.magma.models).sort();

export const selectTemplate = (state, model_name) => (
  (model_name && state.magma.models[model_name]) ? state.magma.models[model_name].template : null
);

const selectModels = (state) => state.magma.models;

export const selectIdentifiers = Reselect.createSelector(
  selectModels,
  (models) => Object.keys(models).reduce(
    (idents, model_name) => {
      idents[model_name] = Object.keys(models[model_name].documents);
      return idents;
    }, {}
  )
)
