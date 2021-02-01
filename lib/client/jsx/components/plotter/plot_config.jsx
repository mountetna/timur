import * as React from 'react';
import Dropdown from '../inputs/dropdown';
import PlotVariables from './plot_variables';

const PlotConfig = ({ config: { variables: config_variables, label, series_types }, onChange, updateType, updateSeries, plot_series, variables: plot_variables }) =>
  <div className='plot-series-config'>
    <div className='pc-wrapper'>
      <div className='pc-header-title-text'>
        {label}
        <i onClick={() => {
            updateType(null);
            updateSeries([]);
          }}
          className='pc-close fa fa-times'
        />
      </div>
      <PlotVariables
        config_variables={ config_variables }
        variables={ plot_variables }
        onChange={onChange}/>
      <div className='pc-series'>
        <Dropdown
          default_text='Add Series'
          list={Object.keys(series_types)}
          onSelect={index => {
            let new_series = {
              series_type: Object.keys(series_types)[index],
              variables: {},
              name: null
            };
            updateSeries([
              new_series,
              ...(plot_series || [])
            ]);
          }}
          selected_index={null}
        />
      </div>
    </div>
  </div>;

export default PlotConfig;
