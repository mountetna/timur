import * as React from 'react';
import PlotVariables from './plot_variables';
import TextInput from '../inputs/text_input';

const PlotSeries = ({
  plot_series: {variables, series_type, name},
  onChange, series_config, onDelete
}) =>
  <div className='ps-card-container'>
    <div className='ps-header'>
      {series_type}
      <i onClick={onDelete} className='fas fa-times'/>
    </div>
    <TextInput header='name' value={name} onChange={
       new_value => onChange('name', new_value)
    }/>
    <PlotVariables
      config_variables={series_config.variables}
      variables={variables}
      onChange={onChange}
    />
  </div>;

export default PlotSeries;
