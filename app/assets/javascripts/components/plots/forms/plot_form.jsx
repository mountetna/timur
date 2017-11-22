import React, { Component } from 'react';
import Plot from '../plot';
import ButtonBar from '../../button_bar';
import Select from '../../inputs/select';
import InputField from '../../inputs/input_field';
import { withIntegerFilter } from '../../inputs/numeric_input';

/*
This is the component to create a plot form for plot types.
 */

export default (
  plotTypeLabel, //Label for the plot type
  defaultPlotConfig, //the default plot configuration - form state
  clearedManifestFields = [], //fields that return to the default plot config values when the manifest changes
  plotFormFields = [], //input fields for the plot
  dataFormFields = [], //input fields for the data series
  defaultData, //default form state for data series
  addSeriesData = (newSeries, seriesData) => [...seriesData, newSeries] //function to add the data series
) => {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        data: defaultData, //data series that gets edited and added to the state.plot.data array
        manifestIdUpdated: false //bit to check if the manifestId changed
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

    //some fields are dependent on the selected manifest so they have to be cleared when the manifest is changed
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

    //copy the values with the same field names when the plot type is changed
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

    formFields() {
      const injectedProps = {
        updatePlot: this.props.updatePlot,
        plot: this.props.plot,
        consignment: this.props.consignment
      };

      return plotFormFields.map((Field, i) => <Field key={i} {...injectedProps} />);
    }

    //when a new series is added to the data array add an id to the series and update plot configuration
    addDataRef() {
      const newSeries = {
        ...this.state.data,
        id: Math.random()
      };
      let updatedPlot = { ...this.props.plot };
      updatedPlot.data = addSeriesData(newSeries, updatedPlot.data);
      this.props.updatePlot(updatedPlot);
    }

    //delete a series from the data array by id
    removePlotRefData(id) {
      let updatedPlot = { ...this.props.plot };
      updatedPlot.data = updatedPlot.data.filter(series => series.id != id);
      this.props.updatePlot(updatedPlot);
    }

    //form fields are injected with props
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
      const {
        toggleEditing, selectedManifest, handleSave, isNewPlot, plot, consignment, changePlotType, manifests, selectManifest
      } = this.props;

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
          <PlotSelector
            isNewPlot={isNewPlot}
            changePlotType={changePlotType}
            plot={plot}
            plotTypeLabel={plotTypeLabel}
          />
          <ManifestSelector
            isNewPlot={isNewPlot}
            manifests={manifests}
            selectManifest={selectManifest}
            plot={plot}
            selectedManifest={selectedManifest}
          />
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

const PlotSelector = ({ isNewPlot, changePlotType, plot, plotTypeLabel }) => {
  if (!isNewPlot) {
    return <div>{`Plot Type: ${plotTypeLabel}`}</div>;
  }

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
      onChange={changePlotType}
      options={options}
      value={plot.plot_type}
    />
  );
};

const ManifestSelector = ({ isNewPlot, manifests, selectManifest, plot, selectedManifest }) => {
  if (!isNewPlot) {
    return <div>{`Manifest: ${selectedManifest.name}`}</div>;
  }

  const options = manifests.map(({ id, name }) => {
    return {
      value: id,
      label: name
    };
  });

  return (
    <Select
      hasNull={false}
      label={'Manifest'}
      onChange={(id) => selectManifest(id)}
      options={options}
      value={plot.manifest_id}
    />
  );
};

/*
input components subscribe to a property from the plot configuration state.
eg. subscribePlotInputField(['layout', 'height'])(IntegerField('Height: '))
the nested value for { layout: { height: value } } is injected into the input component
*/
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

export const MatrixSelector = (label) => ({ consignment, ...passThroughProps }) => (
  <Select
    label={label}
    options={consignment ? consignment.matrixKeys() : []}
    hasNull={true}
    {...passThroughProps}
  />
);

export const VectorSelector = (label) => ({ consignment, ...passThroughProps }) => (
  <Select
    label={label}
    options={consignment ? consignment.vectorKeys() : []}
    hasNull={true}
    {...passThroughProps}
  />
);

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
