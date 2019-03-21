import { mapObject } from '../utils/types';
import { seriesComputedVars, seriesExpressionVars, seriesOtherVars, computedVars } from './plot_config';

// script addendum helpers
export const varName = (name, vname) => `${name}____${vname}`;

export const seriesVars = (plot_series, vname) =>
  plot_series.map((s, index) => `@${varName(`series${index}`, vname)}`);

// this is a convenience function to map a group name and a set of variables
// to a manifest script, e.g., '@name____var = var_value\n...'
const scriptBlock = (name, vars) =>
  Object.keys(vars)
    .map(v => `@${varName(name, v)} = ${vars[v]}`)
    .join('\n');

/* These are the three types of additions we make to the original plot script
 * inputs - for each varname, value, adds @varname = value (e.g. for @record_name)
 * series - for each series { name, variables: { varname: expression, ... } },
 *   adds @name____varname = expression
 * plot - for the given plot_type, add whatever variables the plot requires
 */

const inputAddendum = inputs =>
  Object.keys(inputs)
    .map(i => `@${i} = '${inputs[i]}'`)
    .join('\n');

// the basic variables required for each series (e.g. { x, y })
const seriesVarsAddendum = (plot_type, plot_series) => {
  if (!plot_series) return '';

  return plot_series.map(
    ({ variables, series_type }, index) => scriptBlock(
      `series${index}`,
      seriesExpressionVars(plot_type, series_type, variables)
    )
  ).join('\n');
}

const seriesComputedAddendum = (plot_type, series_type, index) => {
  let computed = seriesComputedVars(plot_type, series_type);
  return computed ? mapObject(computed, (k,func) => func(index)) : '';
}

// plot-specific calculations to be added to the manifest
const plotComputedAddendum = (plot_type, plot_series) =>
  !plot_series ? '' :
    scriptBlock(
      plot_type,
      mapObject(computedVars(plot_type), (name,func) => func(plot_series))
    );

// computes the data variables to be added to the consignment
export const plotScript = (plot, inputs) => {
  if (!plot) return plot;

  let {
    script,
    plot_type,
    configuration: { plot_series }
  } = plot;

  return [
    inputAddendum(inputs),
    script,
    seriesVarsAddendum(plot_type, plot_series),
    //plotVarsAddendum(plot_type, plot_series),
    plotComputedAddendum(plot_type, plot_series)
  ].join('\n');
};

/*
 * This undoes the work of the addendums - i.e., it finds the
 * correspondingly-named values in the consignment and binds them into the
 * original plot_series hash (replacing the expression)
 */

const getConsignmentVars = (name, varnames, consignment) =>
  varnames.reduce((vars, v) => {
    vars[v] = consignment[varName(name, v)];
    return vars;
  }, {});

// the consignment data bound back into a series list
const bindSeriesData = (
  plot_type,
  { name, variables, series_type },
  varName,
  consignment
) => ({
  name,
  series_type,
  variables: {
    // any expressions that had to be computed are extracted from the consignment
    ...getConsignmentVars( varName,
      Object.keys(seriesExpressionVars(plot_type, series_type, variables)),
      consignment
    ),
    // series-specific computed vars are also extracted
    ...getConsignmentVars( varName,
      Object.keys(seriesComputedVars(plot_type, series_type)),
      consignment
    ),
    // also add non-expression variables as-is
    ...seriesOtherVars(plot_type, series_type, variables)
  }
});

// bind the consignment variables back into the plot
const bindPlotData = (plot_type, consignment) =>
  consignment
    ? getConsignmentVars(plot_type, Object.keys(computedVars(plot_type)), consignment)
    : {};

export const plotData = (
  { configuration: { plot_series }, plot_type },
  consignment
) =>
  plot_series
    ? {
        plot_series: plot_series.map((series, index) =>
          bindSeriesData(plot_type, series, `series${index}`, consignment)
        ),
        ...bindPlotData(plot_type, consignment)
      }
    : {};
