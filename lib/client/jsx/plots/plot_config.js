import { seriesVars, varName } from './plot_script';

const XYConfig = {
  name: 'xy',
  label: 'XY Plot',
  computed: {
    xdomain: plot_series => {
      let all_x = seriesVars(plot_series, 'x').join(', ');
      return `[ min( concat( ${all_x})), max( concat( ${all_x})) ]`;
    },
    ydomain: plot_series => {
      let all_y = seriesVars(plot_series, 'y').join(', ');
      return `[ min( concat( ${all_y})), max( concat( ${all_y})) ]`;
    }
  },
  variables: {
    x_label: { type: 'string', required: true },
    y_label: { type: 'string', required: true },
    xmin: { type: 'number', required: false },
    xmax: { type: 'number', required: false },
    ymin: { type: 'number', required: false },
    ymax: { type: 'number', required: false }
  },
  series_types: {
    line: {
      variables: {
        x: { type: 'expression', required: true },
        y: { type: 'expression', required: true },
        label: { type: 'expression', required: false },
        color: { type: 'color', required: false }
      }
    },
    scatter: {
      variables: {
        x: { type: 'expression', required: true },
        y: { type: 'expression', required: true },
        label: { type: 'expression', required: false },
        color: { type: 'color', required: false }
      }
    }
  }
};

const CategoryConfig = {
  name: 'category',
  label: 'Category Plot',
  variables: {
    category_label: { type: 'string', required: true },
    value_label: { type: 'string', required: true },
    value_min: { type: 'number', required: false },
    value_max: { type: 'number', required: false }
  },
  computed: {
    domain: plot_series => {
      let all_values = seriesVars(plot_series, 'value').join(', ');
      return `[ min( concat( ${all_values})), max( concat( ${all_values})) ]`;
    }
  },

  series_types: {
    bar: {
      variables: {
        value: { type: 'expression', required: true },
        category: { type: 'expression', required: true },
        color: { type: 'color', required: false }
      }
    },
    stackedbar: {
      variables: {
        value: { type: 'expression', required: true },
        category: { type: 'expression', required: true },
        subcategory: { type: 'expression', required: true },
        color: { type: 'color', required: false }
      }
    },
    box: {
      variables: {
        value: { type: 'expression', required: true },
        category: { type: 'expression', required: true },
        label: { type: 'expression', required: false },
        color: { type: 'color', required: false }
      }
    },
    swarm: {
      variables: {
        value: { type: 'expression', required: true },
        category: { type: 'expression', required: true },
        label: { type: 'expression', required: false },
        color: { type: 'color', required: false }
      }
    }
  }
};

export const plotTypes = () => Object.keys(PLOTS).sort();

const validPlot = (plot_type) => plot_type && PLOTS[plot_type];

export const plotConfig = (plot_type) => validPlot(plot_type) || {};

export const seriesConfig = (plot_type, series_type) =>
  (validPlot(plot_type) && series_type &&
    series_type in PLOTS[plot_type].series_types) ? PLOTS[plot_type].series_types[series_type] : {};

export const seriesExpressionVars = (plot_type, series_type, variables) =>
  Object.keys(variables).filter(
    v => seriesConfig(plot_type, series_type).variables[v].type == 'expression'
  ).reduce(
    (vars, v) => { vars[v] = variables[v]; return vars }, {}
  );

export const seriesOtherVars = (plot_type, series_type, variables) =>
  Object.keys(variables).filter(
    v => seriesConfig(plot_type, series_type).variables[v].type != 'expression'
  ).reduce(
    (vars, v) => { vars[v] = variables[v]; return vars }, {}
  );

export const seriesComputedVars = (plot_type, series_type) => seriesConfig(plot_type, series_type).computed || {};

export const computedVars = (plot_type) =>
  (validPlot(plot_type) && PLOTS[plot_type].computed) || {};

export const PLOTS = {
  xy: XYConfig,
  category: CategoryConfig
};
