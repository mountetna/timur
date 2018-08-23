import { createSelector } from 'reselect';

export const getSelectedPlotId = (state)=>{
  return state.plots.selected;
};

/*
  boxplot
  barplot
  stackedbar
  histogram
  swarm
  scatter
  heatmap
*/
const PLOTS = {
// these functions compute the plot-specific manifest script
  lineplot: {
    variables:  [ 'xdomain', 'ydomain' ],
    addendum: (plot_series) => {
      let all_x = seriesVars(plot_series,'x').join(', ');
      let all_y = seriesVars(plot_series,'y').join(', ');

      return {
        xdomain: `[ min( concat( ${ all_x })), max( concat( ${ all_x })) ]`,
        ydomain: `[ min( concat( ${ all_y })), max( concat( ${ all_y })) ]`
      };
    }
  }
};

// script addendum helpers
const varName = (name,vname) => `${name}____${vname}`;

const seriesVars = (plot_series, vname) => plot_series.map(
  ({name}) => `@${varName(name,vname)}`
);

const scriptBlock = (name, vars) => Object.keys(vars).map(
    v => `@${varName(name, v)} = ${vars[v]}`
  ).join('\n');

const getConsignmentVars = (name, varnames, consignment) => varnames.reduce(
  (vars, v) => { vars[v] = consignment[varName(name,v)]; return vars; },
  {}
);


/* These are the three types of additions we make to the original plot script
 * inputs - for each varname, value, adds @varname = value (e.g. for @record_name)
 * series - for each series { name, variables: { varname: expression, ... } },
 *   adds @name____varname = expression
 * plot - for the given plot_type, add whatever variables the plot requires
 */

const inputAddendum = (inputs) => Object.keys(inputs).map(
  i => `@${i} = '${inputs[i]}'`
).join('\n');

// the basic variables required for each series (e.g. { x, y })
const seriesAddendum = (plot_series) => plot_series ? plot_series.map(
  ({name,variables}) => scriptBlock(name, variables)
).join('\n') : '';

// plot-specific calculations to be added to the manifest
const plotAddendum = (plot_type, plot_series) => (plot_type && plot_series && (plot_type in PLOTS)) ?
  scriptBlock(plot_type, PLOTS[plot_type].addendum(plot_series))
  : '';

// computes the data variables to be added to the consignment
export const plotScript = (plot, inputs) => {
  if (!plot) return plot;

  let { script, plot_type, configuration: { plot_series } } = plot;

  return [ inputAddendum(inputs), script, seriesAddendum(plot_series), plotAddendum(plot_type, plot_series) ].join('\n');
}


/*
 * This undoes the work of the addendums - i.e., it finds the correspondingly-named values in the
 * consignment and binds them into the original plot_series hash (replacing the expression)
 */

// the consignment data bound back into a series list
const bindSeriesData = ({name,variables}, consignment) => ({
  name,
  variables: getConsignmentVars(name, Object.keys(variables), consignment)
});

// bind the consignment variables back into the plot
const bindPlotData = (plot_type, consignment) => (plot_type && consignment && (plot_type in PLOTS)) ?
  getConsignmentVars(plot_type, PLOTS[plot_type].variables, consignment) : {};

export const plotData = ({configuration: { plot_series }, plot_type}, consignment) => plot_series ? {
  plot_series: plot_series.map(series => bindSeriesData(series, consignment)),
  ...bindPlotData(plot_type, consignment)
} : {};

// this strange return value is because reselect doesn't let us have optional args
const selectPlotById = (state, plot_id, inputs) => plot_id ? [ state.plots.plotsMap[plot_id], inputs ] : [];

const plotWithScript = ([ plot, inputs ]) => ( { ...plot, plotScript: plotScript(plot, inputs) });

export const selectPlot = createSelector(
  selectPlotById,
  plotWithScript
);

export const getAllPlots= (state)=>{
  return Object.values(state.plots.plotsMap);
}

export const getPlotsByManifestId = (state, manifestId)=>{
  return getAllPlots(state).filter((plot)=>{
    return plot.manifestId === manifestId
  });
}

export const getSelectedPlot = (state)=>{
  if(state.plots.selected > 0){
    return state.plots.plotsMap[state.plots.selected];
  }

  /*
   * If the selected id is equal to 0 then retrun a new plot. The access is hard
   * set to 'private' on the server for now.
   */
  if(state.plots.selected == 0){
    return {
      id: 0,
      name: null,
      user_id: null,
      manifest_id: null,
      project: null,
      access: 'private', 
      plot_type: null,
      data: [],
      is_editable: true,
      layout: {
        height: 0,
        width: 0
      },
      config: {
        displayModeBar: true,
        modeBarButtonsToRemove: [
          'sendDataToCloud',
          'lasso2d',
          'toggleSpikelines'
        ],
        showLink: false
      }
    }
  }

  /*
   * If there is no specified plot and we are not requesting a new 
   * plot (id == 0) then return null, and clear the screen.
   */
  return null;
}
