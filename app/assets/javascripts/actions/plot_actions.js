// Module imports.
import * as MessageActions from './message_actions';
import * as PlotsAPI from '../api/plots_api';
import * as PlotSelector from '../selectors/plot_selector';

// Remove a plot from the store.
const removePlot = (id)=>({
  type: 'REMOVE_PLOT',
  id
});

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

export const requestPlots = ()=>{
  return (dispatch)=>{

    let localSuccess = ({plots})=>{
      plots.forEach((plot)=>{

        // Flatten the 'configuration';
        plot = Object.assign(plot, plot.configuration);
        delete plot.configuration;

        dispatch(addPlot(plot));
      });
    }

    let localError = (err)=>{
      showErrors(err, dispatch);
    };

    PlotsAPI.fetchPlots()
      .then(localSuccess)
      .catch(localError);
  };
};

// Delete a plot from the database and the store.
export const deletePlot = (plot)=>{
  return (dispatch, getState)=>{

    let localSuccess = ()=>{
      dispatch(removePlot(plot.id));

      if(ManifestSelector.getSelectedPlotId(getState()) == plot.id){
        dispatch(selectPlot(null));
      }
    };

    PlotsAPI.destroyPlot(plot)
      .then(localSuccess);
  };
};

const addEditedPlot = (apiAction)=>(plot)=>{
  return (dispatch)=>{

    let localSuccess = (response)=>{
      // Flatten the 'configuration';
      plot = Object.assign(response, response.configuration);

      dispatch(addPlot(plot));
      dispatch(selectPlot(plot.id));
    };

    let localError = (error)=>{
      showErrors(error, dispatch);
    };

    apiAction(plot)
      .then(localSuccess)
      .catch(localError);
  };
};

// Put to update plot and update in store.
export const savePlot = addEditedPlot(PlotsAPI.updatePlot);

// Post to create new plot and save in the store.
export const saveNewPlot = addEditedPlot(PlotsAPI.createPlot);

const showErrors = (e, dispatch)=>{
  let localError = (json)=>dispatch(MessageActions.showMessages(json.errors));
  e.response.json()
    .then(localError);
};
