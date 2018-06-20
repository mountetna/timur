export const heatMapFormData = (series_options)=>{
  return {
    form_headers: {},
    series_fields: {
      matrix: series_options
    }
  };
}
