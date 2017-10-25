import { headers, parseJSON, checkStatus } from './fetch_utils'

export const plotIndexUrl = (queryParams) => {
  let path = Routes.plots_path(PROJECT_NAME);

  // list of params
  const params = Object.keys(queryParams);

  // append params and values to path
  if (params[0]) {
    path = path + '?';
    params.forEach((param, i) => {
      if (i === 0) {
        path = path + param + '=' + queryParams[param];
      } else {
        path = path + '&' + param + '=' + queryParams[param];
      }
    })
  }

  return path;
};

export const createPlot = (plot) =>
  fetch(Routes.manifests_plots_create_path(PROJECT_NAME, plot.manifestId), {
    credentials: 'same-origin',
    method: 'POST',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plotToJson(plot))
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(plotFromJson)

export const destroyPlot = (plot) =>
  fetch(Routes.manifests_plots_destroy_path(PROJECT_NAME, plot.manifestId, plot.id), {
    credentials: 'same-origin',
    headers: headers('json', 'csrf'),
    method: 'DELETE'
  })
    .then(checkStatus)
    .then(parseJSON)

export const updatePlot = (plot) =>
  fetch(Routes.manifests_plots_update_path(PROJECT_NAME, plot.manifestId, plot.id), {
    credentials: 'same-origin',
    method: 'PUT',
    headers: headers('json', 'csrf'),
    body: JSON.stringify(plotToJson(plot))
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(plotFromJson)



// data transformation of api JSON plot object for the data store
export const plotFromJson = (plotJSON, editable = true) => {
  const transformedPlot = {
    plotType: plotJSON.plot_type,
    id: plotJSON.id,
    editable,
    manifestId: plotJSON.manifest_id,
    name: plotJSON.name
  };

  // add all fields in configuration to the top level object
  if (plotJSON.configuration) {
    Object.entries(plotJSON.configuration).map(([ key, value ]) => {
      transformedPlot[key] = value;
    });
  }

  return transformedPlot;
}

// transform data store plot object to plot JSON for creating and updating plots
const plotToJson = (plot) => {

  // data fields for all plot types
  const plotFields = ['id', 'name', 'plotType']

  // configurable plot data
  const configuration = Object.entries(plot).reduce((config, [ key, value ]) => {
    if (plotFields.includes(key)) {
      return config;
    }
    return {
      ...config,
      [key]: value
    };
  }, {});

  return {
    id: plot.id,
    name: plot.name,
    plot_type: plot.plotType,
    configuration
  };
}

