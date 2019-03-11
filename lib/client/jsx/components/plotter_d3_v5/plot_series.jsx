import * as React from 'react';
import TextInput from '../inputs/text_input';

class PlotSeries extends React.Component {
  render(){
    const {plot_series, onChange, series_config, onDelete} = this.props;
    const {variables, series_type, name} = plot_series;

    return(
      <div className='ps-card-container'>
        <div className='ps-header'>
          {series_type}
          <i onClick={onDelete} className='right fa fa-lg'>&times;</i>
        </div>
        <TextInput header='name' value={name} onChange={
           new_value => onChange('name', new_value)
        }/>
        {
          Object.keys(series_config.variables).map(var_name =>
            <TextInput key={var_name}
              header={var_name} value={variables[var_name]}
              onChange={
                new_value => onChange('variables', {...variables, [var_name]: new_value})
              }
            />
          )
        }
      </div>
    );
  }
}
export default PlotSeries;
