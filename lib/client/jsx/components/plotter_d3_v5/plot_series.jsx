import * as React from 'react';
import TextInput from '../inputs/text_input';

const SeriesInput = ({name,config,value,onChange}) =>
  <TextInput header={name} value={value} onChange={onChange}/>;

class PlotSeries extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show_optional: null }
  }

  render(){
    const { show_optional } = this.state;
    const {plot_series, onChange, series_config, onDelete} = this.props;
    const {variables, series_type, name} = plot_series;

    const required_variables = Object.keys(series_config.variables).filter(
      var_name => series_config.variables[var_name].required
    );
    const optional_variables = Object.keys(series_config.variables).filter(
      var_name => !series_config.variables[var_name].required
    );


    return(
      <div className='ps-card-container'>
        <div className='ps-header'>
          {series_type}
          <i onClick={onDelete} className='fas fa-times'/>
        </div>
        <TextInput header='name' value={name} onChange={
           new_value => onChange('name', new_value)
        }/>
        {
          required_variables.map(var_name =>
            <SeriesInput key={ var_name }
              config={series_config.variables[var_name]}
              value={variables[var_name]}
              name={var_name}
              onChange={ new_value => onChange('variables', {...variables, [var_name]: new_value}) }
            />
          )
        }
        { !show_optional && optional_variables.length > 0 && <div className='show' onClick={ () => this.setState({ show_optional: true }) }>
          <i className='fas fa-plus'/>
            More options
          </div>
        }
        {
          show_optional && optional_variables.map(var_name =>
            <SeriesInput key={ var_name }
              config={series_config.variables[var_name]}
              value={variables[var_name]}
              name={var_name}
              onChange={ new_value => onChange('variables', {...variables, [var_name]: new_value}) }
            />
          )
        }
      </div>
    );
  }
}
export default PlotSeries;
