import Matrix from '../matrix';
import Vector from '../vector';

export const getPlotForm = plot => {
  switch(plot.plotType) {
    case 'scatter':
      return ScatterPlotForm;
    case 'heatmap':
      return HeatmapForm;
    default:
      return null;
  }
};

const plotFields = [
  {
    label: 'Title',
    type: 'text',
    name: 'name',
    ref: (plot) => plot
  }, {
    label: 'Height',
    type: 'text',
    name: 'height',
    ref: (plot) => plot.layout
  }, {
    label: 'Width',
    type: 'text',
    name: 'width',
    ref: (plot) => plot.layout
  }
];

const ScatterPlotForm = {
  plotTypeLabel: 'Scatter Plot',

  fields: [
    ...plotFields,
    {
      label: 'Y grid',
      type: 'checkbox',
      name: 'showgrid',
      ref: (plot) => plot.layout.yaxis
    }, {
      label: 'X grid',
      type: 'checkbox',
      name: 'showgrid',
      ref: (plot) => plot.layout.xaxis
    },{
      label: 'Reference Table',
      type: 'select',
      name: 'selectedReferenceTable',
      ref: (plot) => plot,
      options: (consignment) => consignmentKeysByType(consignment, Matrix)
    }, {
      label: 'X Axis Label',
      type: 'text',
      name: 'title',
      ref: (plot) => plot.layout.xaxis
    }, {
      label: 'Y Axis Label',
      type: 'text',
      name: 'title',
      ref: (plot) => plot.layout.yaxis
    }
  ],

  dataRefFields: (consignment) => {
    return [
      {
        label: 'Name',
        type: 'text',
        name: 'name',
      }, {
        label: 'Mode',
        type: 'select',
        name: 'mode',
        options: [
          { label: 'Markers', value: 'markers' },
          { label: 'Lines', value: 'lines' },
          { label: 'Lines and Markers', value: 'lines+markers' }
        ]
      }, {
        label: 'X',
        type: 'select',
        name: 'x',
        options: consignmentKeysByType(consignment, Vector)
      }, {
        label: 'Y',
        type: 'select',
        name: 'y',
        location: this,
        options: consignmentKeysByType(consignment, Vector)
      }
    ];
  },

  addDataRef: (plot, dataRef) => {
    return [
      ...plot.data,
      { id: Math.random(), ...dataRef }
    ];
  },

  removeDataRef: (plot, dataId) => {
    return plot.data.filter(ref => ref.id != dataId)
  }
};

const HeatmapForm = {
  plotTypeLabel: 'Heatmap',

  fields: [
    ...plotFields
  ],

  dataRefFields: (consignment) => {
    return [
      {
        label: 'Matrix',
        type: 'select',
        name: 'matrix',
        options: consignmentKeysByType(consignment, Matrix)
      }
    ];
  },

  addDataRef: (plot, dataRef) => {
    return [
      {
        id: Math.random(),
        name: dataRef.matrix,
        ...dataRef
      }
    ];
  },

  removeDataRef: (plot, dataId) => {
    return plot.data.filter(ref => ref.id != dataId)
  }
};

const consignmentKeysByType = (consignment, type) => {
  return Object.keys(consignment || {}).filter(k => consignment[k] instanceof type)
}