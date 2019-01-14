import * as React from 'react';

class PlotSeries extends React.Component{
  constructor(props) {
    super(props);
  }

  renderInput(label_header, value, onChange) {
    return (
      <div key={`${label_header}`}>
        <label className='ps-label'>{label_header}</label>
        <input 
          className='ps-input'
          onChange={(e) =>onChange(label_header, e.target.value)}
          type='text' 
          value={value || ''}
          />
      </div>
    );
  }

  render(){
    const {plot_series, onChange, series_config, onDelete} = this.props;
    const {variables, series_type, name} = plot_series;
    
    return(
      <div className='ps-card-container'>
        <div className='ps-header'>
          {series_type}
          <i onClick={onDelete} className='right fa fa-lg'>&times;</i>
        </div>
        {this.renderInput('name', name, onChange)}
        {Object.keys(series_config.variables).map((var_name) => (this.renderInput(var_name, variables[var_name], 
        (var_name, value)=>onChange('variables', {...variables, [var_name]: value})
        ) ))}
      </div>
    );
  }
}

export default PlotSeries;
