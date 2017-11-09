import React, { Component } from 'react';
import PlotForm, { subscribePlotInputField, commonfields, matrixConsignmentKeyFilter, vectorConsignmentKeyFilter } from './plot_form';
import InputField from '../../inputs/input_field';
import Select from '../../inputs/select';

const scatterPlotFields = [
  subscribePlotInputField('checkbox', 'Y grid: ', ['layout', 'yaxis', 'showgrid'], undefined, (val) => !val)(InputField),
  subscribePlotInputField('checkbox', 'X grid: ', ['layout', 'xaxis', 'showgrid'], undefined, (val) => !val)(InputField),
  subscribePlotInputField(
    undefined,
    'Reference Table',
    ['selectedReferenceTable'],
    matrixConsignmentKeyFilter
  )((props) => <Select {...props} hasNull={true} />),
  subscribePlotInputField('text', 'X Axis Label: ', ['layout', 'yaxis', 'title'])(InputField),
  subscribePlotInputField('text', 'Y Axis Label: ', ['layout', 'xaxis', 'title'])(InputField)
];

const defaultScatterPlot = {
  name: '',
  plotType: 'scatter',
  manifestId: undefined,
  selectedReferenceTable: undefined,
  layout: {
    height: undefined,
    width: undefined,
    yaxis: {
      showgrid: false,
      title: undefined
    },
    xaxis: {
      showgrid: false,
      title: undefined
    }
  },
  data: []
};

const clearedManifestFields = ['data', 'selectedReferenceTable'];

const scatterDataFields = [
  subscribePlotInputField('text','Name: ', ['name'])(InputField),
  subscribePlotInputField(
    undefined,
    'mode',
    ['mode'],
  )((props) => <Select
    {...props}
    hasNull={false}
    options={[
      { label: 'Markers', value: 'markers' },
      { label: 'Lines', value: 'lines' },
      { label: 'Lines and Markers', value: 'lines+markers' }
    ]}
  />),
  subscribePlotInputField(
    undefined,
    'X',
    ['x'],
    vectorConsignmentKeyFilter
  )((props) => <Select {...props} hasNull={true} />),
  subscribePlotInputField(
    undefined,
    'Y',
    ['y'],
    vectorConsignmentKeyFilter
  )((props) => <Select {...props} hasNull={true} />)
];

let defaultDataFields = {
  mode: 'markers',
  name: undefined,
  x: undefined,
  y: undefined
};

export default PlotForm('Scatter Plot', defaultScatterPlot, clearedManifestFields, [...commonfields, ...scatterPlotFields], scatterDataFields, defaultDataFields);