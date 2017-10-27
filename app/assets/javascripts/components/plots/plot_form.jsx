import React, { Component } from 'react'
import Plot from './plot'
import ButtonBar from '../button_bar'
import InputField from '../form_inputs/input_field'
import Select from '../form_inputs/select'
import { getPlotForm } from '../../selectors/plot_form'


class PlotForm extends Component {
  constructor(props) {
    super(props);

    // set the state if a new plot is being created
    if (!props.plot) {
      this.state = {
        plotType: null,
        manifestId: null,
        layout: {
          xaxis: {},
          yaxis: {}
        },
        data: []
      };
    }
  }

  componentWillMount() {
    this.setPlot();
  }

  setPlot() {
    this.setState({ ...this.props.plot });
  }

  handleSave() {
    if (this.props.plot) {
      this.props.savePlot({ ...this.state });
    }
    else {
      this.props.saveNewPlot({ ...this.state });
    }
  }

  plotTypeSelector() {
    const options = [
      {
        value: 'scatter',
        label: '2d scatter'
      },
      {
        value: 'heatmap',
        label: 'heatmap'
      }
    ]

    return (
      <Select
        hasNull={true}
        label={'Plot Type'}
        onChange={(value) => this.setState({ plotType: value })}
        options={options}
        value={this.state.plotType}
      />
    );
  }

  selectManifest(manifestId) {
    this.setState(
      prevState => ({ manifestId }),
      () => this.props.selectManifest(manifestId)
    )
  }

  manifestSelector() {
    const selectedManifest = this.state.manifestId;
    const options = this.props.manifests.map(({ id, name }) => {
      return {
        value: id,
        label: name
      };
    });

    return (
      <Select
        hasNull={true}
        label={'Manifest'}
        onChange={this.selectManifest.bind(this)}
        options={options}
        value={selectedManifest}
      />
    );
  }

  handleFieldUpdate(field, value, fieldRef = (state) => state) {
    this.setState(
      prevState => {
        const newValue = field.type === 'checkbox' ? !this.fieldValue(prevState, field, fieldRef) : value;
        const newState = { ...prevState };
        fieldRef(newState)[field.name] = newValue;
        return newState;
      }
    );
  }

  fieldValue(state, field, fieldRef = (state) => state) {
    return fieldRef(state)[field.name];
  }

  fieldToInputField(field, updateHandler, currentValue, consignment) {
    switch (field.type) {
      case 'text':
        return (
          <InputField
            type={field.type}
            label={`${field.label}: `}
            onChange={(value) => updateHandler(field, value, field.ref)}
            value={currentValue}
          />
        );
      case 'checkbox':
        return (
          <InputField
            type={field.type}
            label={`${field.label}: `}
            onChange={(value) => updateHandler(field, value, field.ref)}
            checked={currentValue}
          />
        );
      case 'select':
        const options = Array.isArray(field.options) ? field.options : field.options(consignment)
        return (
          <Select
            hasNull={true}
            label={field.label}
            onChange={(value) => updateHandler(field, value, field.ref)}
            options={options}
            value={currentValue}
          />
        );
      default:
        return <div></div>
    }
  }

  formFields(plotForm, consignment) {
    return plotForm.fields.map((field, i) => {
      return (
        <div key={i}>
          {this.fieldToInputField(field, this.handleFieldUpdate.bind(this), this.fieldValue(this.state, field, field.ref), consignment)}
        </div>
      );
    });
  }

  addDataRef(dataRef) {
    this.setState(
      prevState => {
        return {
          data: getPlotForm(prevState).addDataRef(prevState, dataRef)
        };
      }
    );
  }

  removeDataRef(dataId) {
    this.setState(
      prevState => {
        return {
          data: getPlotForm(prevState).removeDataRef(prevState, dataId)
        };
      }
    );
  }

  render () {
    const plotForm = getPlotForm(this.state)
    if (!plotForm) {
      return (
        <div className='plot-form-container'>
          {this.plotTypeSelector()}
        </div>
      )
    }

    const { toggleEditing, selectedManifest, consignment, plot} = this.props;

    return (
      <div className='plot-form-container'>
        <ButtonBar
          className='actions'
          buttons={[
            {
              click: this.handleSave.bind(this),
              icon: 'floppy-o',
              label: 'save'
            }, {
              click: () => toggleEditing(false),
              icon: 'ban',
              label: 'cancel'
            }
          ]}
        />
        {plot ? <span>{`Manifest: ${selectedManifest.name}`}</span> : this.manifestSelector()}
        <fieldset>
          <legend>{plotForm.plotTypeLabel}</legend>
          {this.formFields(plotForm, consignment)}
        </fieldset>
        <DataRefForm
          dataRefs={this.state.data}
          addDataRef={this.addDataRef.bind(this)}
          removeDataRef={this.removeDataRef.bind(this)}
          fields={plotForm.dataRefFields(consignment)}
          handleFieldUpdate={this.handleFieldUpdate}
          fieldValue={this.fieldValue}
          fieldToInputField={this.fieldToInputField}
        />
        <Plot
          plot={{...this.state}}
          consignment={consignment}
        />
      </div>
    )
  }
}

class DataRefForm extends Component {
  constructor(props) {
    super(props);

    const formState = this.props.fields.reduce((formState, field) => {
      let defaultValue;
      if (field.type === 'select' && field.options[0]) {
        if (typeof field.options[0] == 'string') {
          defaultValue = field.options[0];
        } else {
          defaultValue = field.options[0].value;
        }
      } else {
        defaultValue = '';
      }
      return {...formState, [field.name]: defaultValue};
    }, {})

    this.state = formState;
  }


  dataRefList() {
    return (
      <ul>
        {this.props.dataRefs.map(({ name, id }) => (
          <li key={id}>
            {name + ' '}
            <i className='fa fa-times' aria-hidden='true'
               onClick={() => this.props.removeDataRef(id)}>
            </i>
          </li>
        ))}
      </ul>
    );
  }

  formFields() {
    return this.props.fields.map((field, i) => {
      return (
        <div key={i}>
          {this.props.fieldToInputField(field, this.props.handleFieldUpdate.bind(this), this.props.fieldValue(this.state, field))}
        </div>
      );
    });
  }

  render() {
    return (
      <fieldset style={{ marginBottom: 10 }}>
        <legend>Data</legend>
        {this.dataRefList()}
        {this.formFields()}
        <input type='button' value='Add' onClick={() => this.props.addDataRef(this.state)} />
      </fieldset>
    )
  }
}

export default PlotForm;
