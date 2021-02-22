// Module imports.
import {getOpts, postOpts, deleteOpts, checkStatus} from 'etna-js/utils/fetch';

export const fetchPlots = ()=> fetch(
  Routes.fetch_plots_path(CONFIG.project_name), getOpts
).then(checkStatus);

export const createPlot = (plot)=> fetch(
  Routes.create_plot_path(CONFIG.project_name), postOpts(plot)
).then(checkStatus);

export const destroyPlot = (plot)=> fetch(
  Routes.destroy_plot_path(CONFIG.project_name, plot.id), deleteOpts
).then(checkStatus);

export const getPlot = (exchange) => (plot_id) => exchange.fetch(
  Routes.get_plot_path(CONFIG.project_name, plot_id), getOpts
).then(checkStatus);

export const updatePlot = (plot)=> fetch(
  Routes.update_plot_path(CONFIG.project_name, plot.id), postOpts(plot)
).then(checkStatus);
