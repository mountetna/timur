import * as React from 'react';
import TextInput from '../inputs/text_input';

const Variable = ({name,config,value,onChange}) =>
  <TextInput header={name.replace('_',' ')} value={value}
    placeholder={ config.hint || config.type }
    onChange={onChange}/>;

export default class PlotVariables extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show_optional: null }
  }

  render() {
    const { config_variables={}, variables={}, onChange } = this.props;
    const { show_optional } = this.state;

    const required_variables = Object.keys(config_variables).filter(
      var_name => config_variables[var_name].required
    );
    const optional_variables = Object.keys(config_variables).filter(
      var_name => !config_variables[var_name].required
    );

    return <div className='plot-variables'>
      {
        required_variables.map(var_name =>
          <Variable key={ var_name }
            config={config_variables[var_name]}
            value={variables[var_name]}
            name={var_name}
            onChange={
              new_value => onChange('variables', {...variables, [var_name]: new_value})
            }
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
          <Variable key={ var_name }
            config={config_variables[var_name]}
            value={variables[var_name]}
            name={var_name}
            onChange={
              new_value => onChange('variables', {...variables, [var_name]: new_value})
            }
          />
        )
      }
    </div>;
  }
}
