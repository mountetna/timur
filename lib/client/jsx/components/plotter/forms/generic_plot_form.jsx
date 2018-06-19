// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

export class GenericPlotForm extends React.Component{
  constructor(props){
    super(props);
  }

  updateSeriesHandler(series_index, field, value){
    return (event)=>{
      this.props.updateSeries(series_index, field, event.target.value);
    }
  }

  removeSeriesHandler(series_index){
    return (event)=>{
       this.props.removeSeries(series_index);
    }
  }

  addSeries(event){
    /*
     * Rebuild an empty series object from the associated 
     * `form_data.series_fields` object.
     */
    let series_object = {name: null};
    Object.keys(this.props.form_data.series_fields).forEach((key, index)=>{
      series_object[key] = null;
    });

    this.props.addSeries(series_object);
  }

  renderSeriesOptions(series_arguments){

    let {
      series_item_field,
      series_item_options,
      series_item_value,
      series_index
    } = series_arguments;

    let options = series_item_options.map((option, series_index)=>{

      let opt_props = {
        key: `opt-${series_index}-${series_index}`,
        value: option
      };

      if(option == series_item_value){
        return <option {...opt_props} selected>{option}</option>;
      }
      else{
        return <option {...opt_props}>{option}</option>;
      }
    });

    if(series_item_value == null){
      options.unshift(<option disabled selected value>{'--'}</option>);
    }

    return options;
  }

  renderSeriesFields(series_item, series_index){
    let {form_data, is_editing} = this.props;
    let disabled = (!is_editing) ? 'disabled' : '';
    let options = [];

    let selector_props = {
      className: `${disabled} plotter-selector`,
      disabled
    };

    /*
     * The 'form_data.series_fields' object holds information about the possible
     * options for a selector.
     */
    Object.keys(form_data.series_fields).forEach((key, index)=>{

      // Add selector specific information for the option field.
      selector_props.onChange = this.updateSeriesHandler(series_index, key);
      let series_arguments = {
        series_item_field: key,
        series_item_options: form_data.series_fields[key],
        series_item_value: series_item[key],
        series_index
      };

      // Add the selection to option array.
      options.push([
        <span className='plotter-series-text'>{`${key} :`}</span>,
        <select {...selector_props}>{this.renderSeriesOptions(series_arguments)}</select>
      ]);
    });

    return options;
  }

  renderSeries(){
    let {plot, is_editing} = this.props;
    let disabled = (!is_editing) ? 'disabled' : '';

    let input_props = {
      className: `${disabled} plotter-form-input series-name`,
      type: 'text',
      disabled
    };

    let selector_props = {
      className: `${disabled} plotter-selector`,
      disabled
    };

    let button_props = {
      className: `${disabled} plotter-remove-btn`,
      disabled
    };

    return plot.data.map((series_item, series_index)=>{
      return(
        <div key={`series-${series_index}`} className='plotter-series-entry'>

          <span className='plotter-series-text'>

            {'Name : '}
          </span>
          <input {...input_props} value={series_item.name} onChange={this.updateSeriesHandler(series_index, 'name')} />
          <button {...button_props} onClick={this.removeSeriesHandler(series_index)}>

            <i className='fas fa-times' aria-hidden='true'></i>
            {' REMOVE'}
          </button>
          <br />
          {this.renderSeriesFields(series_item, series_index)}
        </div>
      );
    });
  }

  renderFormHeaders(){
    let {plot, form_data, is_editing} = this.props;
    let disabled = (!this.props.is_editing) ? 'disabled' : '';
    let headers = [];

    let input_props = {
      className: `${disabled} plotter-form-input`,
      onChange: this.props.updateField,
      disabled
    };

    /*
     * The 'form_data.form_headers' object contain settings to render the inputs
     * specific to a plot type.
     */
    Object.keys(form_data.form_headers).forEach((key)=>{

      // Add plot specific form data to the input.
      let {type, value} = form_data.form_headers[key];
      input_props['type'] = type
      input_props['value'] = plot;
      input_props['data-field'] =form_data.form_headers[key]['value'].join('.');

      /*
       * The value for this input is stored in a nested object. An array is
       * provided, 'form_data.form_headers.value', which contains the keys to
       * extract the data value from the plot object.
       */
      for(let a = 0; a < value.length; ++a){
        if(value[a] in input_props['value']){
          input_props['value'] = input_props['value'][value[a]];
        }
      }

      // Add the field title, field input, and a break to the header array.
      let title = `${form_data.form_headers[key].title}: `;
      headers.push([
        <span className='plotter-series-text'>{title}</span>,
        <input {...input_props} />,
        <br />
      ]);
    });

    return headers;
  }

  render(){
    let disabled = (!this.props.is_editing) ? 'disabled' : '';

    let input_props = {
      className: `${disabled} plotter-form-input`,
      type: 'text',
      onChange: ()=>{},
      disabled
    };

    let checkbox_props = {
      type: 'checkbox',
      onChange: ()=>{},
      disabled
    };

    let button_props = {
      className: `${disabled} plotter-add-btn`,
      onClick: this.addSeries.bind(this),
      disabled
    };

    return(
      <div className='plotter-specific-form-group'>

        {this.renderFormHeaders()}
        <div className='plotter-series-data-group'>

          <div className='plotter-series-data-header'>

            <div className='plotter-series-data-title'>

              <span className='plotter-series-text'>

                {'Series Data : '}
              </span>
              <button {...button_props}>

                <i className='fas fa-plus' aria-hidden='true'></i>
                {' ADD SERIES'}
              </button>
            </div>
          </div>
          {this.renderSeries()}
        </div>
      </div>
    );
  }
}
