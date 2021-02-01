// Module imports.
import { showMessages } from './message_actions';
import { fetchPlots, getPlot, destroyPlot, createPlot, updatePlot } from '../api/plots_api';
import * as PlotSelector from '../selectors/plot_selector';
import {Exchange} from './exchange_actions';
import { tryCallback, showErrors } from './action_helpers';

// Remove a plot from the store.
const removePlot = (id)=>({ type: 'REMOVE_PLOT', id });
export const addPlot = (plot)=>({ type: 'ADD_PLOT', plot });

export const selectPoints = (point_ids)=>({
  type: 'SELECT_POINTS',
  ids: point_ids
});

export const requestPlot = (plot_id, success) => (dispatch) =>
  getPlot(new Exchange(dispatch, `plot${plot_id}`))(plot_id)
    .then(
      ({plot})=> {
        dispatch(addPlot(plot));
        tryCallback(success,plot);
      }
    )
    .catch(showErrors(dispatch));

export const requestPlots = () => (dispatch)=>
  fetchPlots()
    .then(
      ({plots})=> {
        plots.forEach((plot)=> dispatch(addPlot(plot)));
      }
    )
    .catch(showErrors(dispatch));

// Delete a plot from the database and the store.
export const deletePlot = (plot, success) => (dispatch)=>
  destroyPlot(plot).then(
    () => {
      dispatch(removePlot(plot.id));
      tryCallback(success);
    }
  );

const addEditedPlot = (apiAction)=>(plot, success)=>(dispatch)=>
  apiAction(plot).then(
    ({plot})=> {
      dispatch(addPlot(plot));
      tryCallback(success, plot);
    }
  ).catch(showErrors(dispatch));

// Put to update plot and update in store.
export const savePlot = addEditedPlot(updatePlot);

// Post to create new plot and save in the store.
export const saveNewPlot = addEditedPlot(createPlot);

export const copyPlot = (plot, success) => (dispatch) =>
  createPlot(
    {...plot, 'name': `${plot.name}(copy)`},
    new Exchange(dispatch, 'copy-plot')
  ).then(
    ({plot})=>{
      dispatch(addPlot(plot));
      tryCallback(success, plot);
    }
  ).catch(showErrors(dispatch));

