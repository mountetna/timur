import React, { Component } from 'react';
import PlotForm, { subscribePlotInputField, commonfields, matrixConsignmentKeyFilter } from './plot_form';
import Select from '../../inputs/select';
import InputField from '../../inputs/input_field';

const defaultHeatmapPlot = {
  name: '',
  plotType: 'heatmap',
  manifestId: undefined,
  layout: {
    height: undefined,
    width: undefined
  },
  data: []
};

const defaultHeatmapData = {
  name: '',
  matrix: undefined
};

const dataFields = [
  subscribePlotInputField('text','Name: ', ['name'])(InputField),
  subscribePlotInputField(
    undefined,
    'Matrix',
    ['matrix'],
    matrixConsignmentKeyFilter
  )((props) => <Select {...props} hasNull={true} />),
];

const addSeriesData = (newSeries) => [newSeries];

export default PlotForm('Heatmap', defaultHeatmapPlot, ['data'], commonfields, dataFields, defaultHeatmapData, addSeriesData);