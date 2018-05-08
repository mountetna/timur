export const selectModelNames = (state) => Object.keys(state.magma.models).sort();

export const selectTemplate = (state, model_name) => (
  (model_name && state.magma.models[model_name]) ? state.magma.models[model_name].template : null
);
