export const selectQuerySelectedModels = (state) =>
  Object.keys(state.attributes);

export const selectQueryRecordFilters = (state) => state.recordFilters;

export const selectQueryValueFilters = (state) => state.valueFilters;
