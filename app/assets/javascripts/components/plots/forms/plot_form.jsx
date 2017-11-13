import React, { Component } from 'react';
import Plot from '../plot';
import ButtonBar from '../../button_bar';
import Select from '../../inputs/select';
import InputField from '../../inputs/input_field';
import Matrix from '../../../models/matrix';
import Vector from '../../../models/vector';
import { withIntegerFilter } from '../../inputs/numeric_input';

export default (
  plotTypeLabel,
  defaultPlotConfig,
  clearedManifestFields = [],
  plotFormFields = [],
  dataFormFields = [],
  defaultData,
  addSeriesData = (newSeries, seriesData) => [...seriesData, newSeries]
) => {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        data: defaultData,
        manifestIdUpdated: false
      };
    }

    componentDidMount() {
      if (this.props.isNewPlot) {
        const currFormState = this.copyPreviousPlotFieldValues();
        this.props.updatePlot(currFormState);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.plot.manifestId != nextProps.plot.manifestId) {
        this.setState({ manifestIdUpdated: true });
      }
    }

    componentDidUpdate() {
      if (this.state.manifestIdUpdated) {
        this.setState(
          { manifestIdUpdated: false },
          () => this.clearManifestFields()
        );
      }
    }

    clearManifestFields() {
      let updatedPlot = { ...this.props.plot };

      clearedManifestFields.forEach(field => {
        if (Array.isArray(field)) {
          let ref = updatedPlot;
          let defaultValRef = defaultPlotConfig;

          field.forEach((fieldName, i) => {
            if (i < field.length - 1) {
              ref = ref[fieldName];
              defaultValRef = defaultValRef[fieldName];
            } else {
              ref = defaultValRef[fieldName];
            }
          });
        } else {
          updatedPlot[field] = defaultPlotConfig[field];
        }
      });

      this.props.updatePlot(updatedPlot);
    }

    copyPreviousPlotFieldValues() {
      const merge = (template, source, key) => {
        if (!source) {
          return template;
        }

        if (Array.isArray(template)) {
          return [];
        }

        return Object.entries(template).reduce((curr, [ key, value ]) => {
          if (!(value instanceof Object)) {
            return {
              ...curr,
              [key]: source[key] || value
            };
          }

          return {
            ...curr,
            [key]: merge(template[key], source[key], key)
          };
        }, {});
      };

      return merge(defaultPlotConfig, this.props.plot);
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
      ];

      return (
        <Select
          hasNull={false}
          label={'Plot Type'}
          onChange={this.props.changePlotType}
          options={options}
          value={this.props.plot.plotType}
        />
      );
    }

    manifestSelector() {
      const options = this.props.manifests.map(({ id, name }) => {
        return {
          value: id,
          label: name
        };
      });

      return (
        <Select
          hasNull={false}
          label={'Manifest'}
          onChange={(id) => this.props.selectManifest(id)}
          options={options}
          value={this.props.plot.manifestId}
        />
      );
    }

    formFields() {
      const injectedProps = {
        updatePlot: this.props.updatePlot,
        plot: this.props.plot,
        consignment: this.props.consignment
      };

      return plotFormFields.map((Field, i) => <Field key={i} {...injectedProps} />);
    }

    addDataRef() {
      const newSeries = {
        ...this.state.data,
        id: Math.random()
      };
      let updatedPlot = { ...this.props.plot };
      updatedPlot.data = addSeriesData(newSeries, updatedPlot.data);
      this.props.updatePlot(updatedPlot);
    }

    removePlotRefData(id) {
      let updatedPlot = { ...this.props.plot };
      updatedPlot.data = updatedPlot.data.filter(series => series.id != id);
      this.props.updatePlot(updatedPlot);
    }

    dataFormFields() {
      const injectedProps = {
        updatePlot: (data) => this.setState({ data }),
        plot: this.state.data,
        consignment: this.props.consignment
      };

      return dataFormFields.map((Field, i) => <Field key={i} {...injectedProps} />);
    }

    dataRefList() {
      const data = this.props.plot.data || [];

      return (
        <ul>
          {data.map(({ name, id }) => (
            <li key={id}>
              {name + ' '}
              <i className='fa fa-times' aria-hidden='true'
                 onClick={() => this.removePlotRefData(id)}>
              </i>
            </li>
          ))}
        </ul>
      );
    }

    render () {
      const { toggleEditing, selectedManifest, handleSave, isNewPlot, plot, consignment } = this.props;

      return (
        <div className='plot-form-container'>
          <ButtonBar
            className='actions'
            buttons={[
              {
                click: handleSave,
                icon: 'floppy-o',
                label: 'save'
              }, {
                click: () => toggleEditing(false),
                icon: 'ban',
                label: 'cancel'
              }
            ]}
          />
          {isNewPlot ? (
            <div>
              {this.plotTypeSelector()}
              {this.manifestSelector()}
            </div>
          ) : (
            <div>
              <div>{`Plot Type: ${plotTypeLabel}`}</div>
              <div>{`Manifest: ${selectedManifest.name}`}</div>
            </div>
          )}
          <fieldset>
            <legend>{plotTypeLabel}</legend>
            {this.formFields()}
          </fieldset>
          <fieldset style={{ marginBottom: 10 }}>
            <legend>Data</legend>
            {this.dataRefList()}
            {this.dataFormFields()}
            <input type='button' value='Add' onClick={() => this.addDataRef()} />
          </fieldset>
          <Plot plot={plot} consignment={consignment}/>
        </div>
      );
    }
  };
};

export const subscribePlotInputField = (plotProperty = []) => (WrappedInput) => (props) => {
  let { value, plot, consignment, updatePlot, ...passThroughProps } = props;

  let currentValue = plotProperty.reduce((currVal, currProperty) => {
    try {
      return currVal[currProperty];
    } catch (e) {
      return null;
    }
  }, plot);

  if (typeof currentValue !== 'string' && isNaN(currentValue)) {
    currentValue = '';
  }

  const update = (value) => {
    let updatedPlot = { ...plot };

    let ref = updatedPlot;
    const finalPropertyIndex = plotProperty.length - 1;
    for (let i = 0; i < finalPropertyIndex; i++) {
      ref = ref[plotProperty[i]];
    }

    ref[plotProperty[finalPropertyIndex]] = value;

    updatePlot(updatedPlot);
  };

  return (
    <WrappedInput
      {...passThroughProps}
      consignment={consignment}
      value={currentValue}
      onChange={update}
    />
  );
};

const consignmentKeysByType = (type) => (consignment) => {
  return Object.keys(consignment || {}).filter(k => consignment[k] instanceof type);
};

const matrixConsignmentKeyFilter = consignmentKeysByType(Matrix);
const vectorConsignmentKeyFilter = consignmentKeysByType(Vector);

const ConsignmentKeySelector = (label, filter) => ({ consignment, ...passThroughProps }) => (
  <Select
    label={label}
    options={filter(consignment)}
    hasNull={true}
    {...passThroughProps}
  />
);

export const MatrixSelector = (label) => ConsignmentKeySelector(label, matrixConsignmentKeyFilter);
export const VectorSelector = (label) => ConsignmentKeySelector(label, vectorConsignmentKeyFilter);
export const Selector = (label, options) => (props) => (
  <Select
    {...props}
    label={label}
    options={options}
    hasNull={false}
  />
);

export const TextField = (label) => ({ type, ...passThroughProps }) => (
  <InputField
    type='text'
    label={label}
    {...passThroughProps}
  />
);

const IntegerField = (label) => withIntegerFilter(TextField(label));

export const CheckBox = (label) => ({ type, value, onChange, ...passThroughProps }) => (
  <InputField
    type='checkbox'
    label={label}
    checked={value}
    onChange={() => onChange(!value)}
    {...passThroughProps}
  />
);

export const commonfields = [
  subscribePlotInputField(['name'])(TextField('Title: ')),
  subscribePlotInputField(['layout', 'height'])(IntegerField('Height: ')),
  subscribePlotInputField(['layout', 'width'])(IntegerField('Width: '))
];
