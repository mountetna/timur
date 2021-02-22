// Module imports.
import {getOpts, postOpts, deleteOpts, checkStatus} from 'etna-js/utils/fetch';

export const fetchAllViews = (exchange) => exchange.fetch(
  Routes.fetch_views_path(CONFIG.project_name),getOpts
).then(checkStatus);

export const getView = (model_name, exchange)=> exchange.fetch(
  Routes.get_view_path(CONFIG.project_name, model_name), getOpts
).then(checkStatus);

export const updateView = (view, model_name, exchange) => exchange.fetch(
  Routes.update_view_path(CONFIG.project_name, model_name), postOpts(view)
).then(checkStatus);

export const createView = (view, exchange)=> exchange.fetch(
  Routes.create_view_path(CONFIG.project_name), postOpts(view)
).then(checkStatus);

export const destroyView = (view, exchange) => exchange.fetch(
  Routes.destroy_view_path(CONFIG.project_name, view.model_name), deleteOpts
).then(checkStatus);

