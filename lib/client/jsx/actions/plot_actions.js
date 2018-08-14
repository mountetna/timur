// Module imports.
import { showMessages } from './message_actions';
import { fetchPlots, getPlot, destroyPlot, updatePlot } from '../api/plots_api';
import * as PlotSelector from '../selectors/plot_selector';

// Remove a plot from the store.
const removePlot = (id)=>({
  type: 'REMOVE_PLOT',
  id
});

const showErrors = (dispatch)=> (error) =>
  error.response.json().then(
    ({errors})=>dispatch(showMessages(errors))
  );

export const selectPlot = (id)=>({
  type: 'SELECT_PLOT',
  id
});

export const addPlot = (plot)=>({
  type: 'ADD_PLOT',
  plot
});

export const selectPoints = (point_ids)=>({
  type: 'SELECT_POINTS',
  ids: point_ids
});

export const requestPlot = (plot_id, success) => (dispatch) =>
  getPlot()
    .then(
      ({plots})=> plots.forEach(plot=> dispatch(addPlot(plot)))
    )
    .catch(showErrors(dispatch));

export const requestPlots = ()=> (dispatch)=>
  fetchPlots()
    .then(
      ({plots})=>plots.forEach((plot)=> dispatch(addPlot(plot)))
    )
    .catch(showErrors(dispatch));

// Delete a plot from the database and the store.
export const deletePlot = (plot) => (dispatch)=>
  destroyPlot(plot).then(
    () => dispatch(removePlot(plot.id))
  );

const addEditedPlot = (apiAction)=>(plot)=>(dispatch)=>
  apiAction(plot).then(
    (plot)=> dispatch(addPlot(plot))
  ).catch(showErrors(dispatch));

// Put to update plot and update in store.
export const savePlot = addEditedPlot(updatePlot);

// Post to create new plot and save in the store.
export const saveNewPlot = addEditedPlot(createPlot);
