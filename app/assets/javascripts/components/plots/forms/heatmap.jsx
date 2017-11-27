import React, { Component } from 'react';
import PlotForm, { subscribePlotInputField, TextField, MatrixSelector, commonfields } from './plot_form';

const defaultHeatmapPlot = {
  name: '',
  plot_type: 'heatmap',
  manifest_id: undefined,
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
  subscribePlotInputField(['name'])(TextField('Name: ')),
  subscribePlotInputField(['matrix'])(MatrixSelector('Matrix'))
];

const addSeriesData = (newSeries) => [newSeries];

export default PlotForm('Heatmap', defaultHeatmapPlot, ['data'], commonfields, dataFields, defaultHeatmapData, addSeriesData);