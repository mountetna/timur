import React from 'react';
import { mount } from 'enzyme';
import { selectPlot } from '../../../lib/client/jsx/selectors/plot_selector';

let plot;
let layout;
let fake_state;
let fake_plot_id;

describe('Plot Selector', () => {
  beforeEach(() => {
    plot = {
      configuration: {
        layout:{
          height:900,
          width:1600,
          margin: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
          }
        },
        plot_series: []
      },
      id:1,
      name:"test",
      plot_type:"scatterplot",
      script: "@x = [ 1, 2, 3 ]\n@y = [ 4, 5, 6]",
      created_at: "2017-09-19T21:06:30.430Z",
      updated_at: "2017-09-19T21:06:30.430Z"
    };

    fake_state = { plots: { plotsMap: { 1: plot } } };
    fake_plot_id = 1;
  });

  it('adds input variables to the beginning of the plotScript', () => {
    const fake_inputs = { name: 'test_record_1', name2: 'test_record_2' };
    const input_variables = "@name = 'test_record_1'\n@name2 = 'test_record_2'\n"
    const selected_plot = selectPlot(fake_state, fake_plot_id, fake_inputs);
    expect(selected_plot.plotScript).toEqual(input_variables + plot.script + '\n\n');
  });

  describe('XY Plot', () => {
    it('adds plot variables for the xy plot to the end of the plotScript', () => {
      let plot_series_obj = {
        name: "test_line",
        variables: {
          x: "@x",
          y: "@y"
        }
      };
      plot.configuration.plot_series.push(plot_series_obj);
      plot.plot_type = 'xy';
      const series_variables = '\n@series0____x = @x\n@series0____y = @y\n';
      const plot_variables = '@xy____xdomain = [ min( concat( @series0____x)), max( concat( @series0____x)) ]\n@xy____ydomain = [ min( concat( @series0____y)), max( concat( @series0____y)) ]';
      const selected_plot = selectPlot(fake_state, fake_plot_id, {});
      expect(selected_plot.plotScript).toEqual('\n' + plot.script + series_variables + plot_variables);
    });
  });
  describe('Category Plot', () => {
    it('adds plot variables for the category plot to the end of the plotScript', () => {
      let plot_series_obj = {
        name: "test_category",
        variables: {
          category: "@x",
          value: "@y"
        }
      };
      plot.configuration.plot_series.push(plot_series_obj);
      plot.plot_type = 'category';
      const series_variables = '\n@series0____category = @x\n@series0____value = @y\n';
      const plot_variables = '@category____domain = [ min( concat( @series0____value)), max( concat( @series0____value)) ]';
      const selected_plot = selectPlot(fake_state, fake_plot_id, {});
      expect(selected_plot.plotScript).toEqual('\n' + plot.script + series_variables + plot_variables);
    });

    it('adds series variables for the beeswarm series to the end of the plotScript', () => {
      let plot_series_obj = {
        name: "test_category",
        series_type: 'beeswarm',
        variables: {
          category: "@x",
          value: "@y"
        }
      };
      plot.configuration.plot_series.push(plot_series_obj);
      plot.plot_type = 'category';
      const series_variables = '\n@series0____category = @x\n@series0____value = @y\n';
      const series_computed_variables = '@series0____beeswarm = beeswarm(@series0____value)\n';
      const plot_variables = '@category____domain = [ min( concat( @series0____value)), max( concat( @series0____value)) ]';
      const selected_plot = selectPlot(fake_state, fake_plot_id, {});
      expect(selected_plot.plotScript).toEqual('\n' + plot.script + series_variables + series_computed_variables + plot_variables);
    });
  });
});
