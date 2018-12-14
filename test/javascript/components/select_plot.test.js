import React from 'react';
import { mount } from 'enzyme';
import { selectPlot } from '../../../lib/client/jsx/selectors/plot_selector';

let plot;
let fake_state;
let fake_plot_id;

describe('Plot Selector', () => {
  beforeEach(() => {
    plot = {
      "configuration": {
        "layout":{
          "height":900,
          "width":1600,
          "margin": {
            "top": 10,
            "bottom": 10,
            "left": 10,
            "right": 10
          }
        },
        "plotType":"",
        "plot_series": []
        },
      "id":1,
      "name":"test",
      "plot_type":"scatterplot",
      "script": "@x = [ 1, 2, 3 ]\n@y = [ 4, 5, 6]",
      "created_at":"2017-09-19T21:06:30.430Z",
      "updated_at":"2017-09-19T21:06:30.430Z"
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

  it('adds plot series variables to the end of the plotScript', () => {
    let plot_series_obj = {
      "name": "test_line",
      "variables": {
        "x": "@x",
        "y": "@y"
      }
    };
    plot.configuration.plot_series.push(plot_series_obj);
    const input_variables = '\n@test_line____x = @x\n@test_line____y = @y\n';
    const selected_plot = selectPlot(fake_state, fake_plot_id, {});
    expect(selected_plot.plotScript).toEqual('\n' + plot.script + input_variables);
  });
  
  it('adds plot variables for the lineplot to the end of the plotScript', () => {
    let plot_series_obj = {
      "name": "test_line",
      "variables": {
        "x": "@x",
        "y": "@y"
      }
    };
    plot.configuration.plot_series.push(plot_series_obj);
    plot.plot_type = 'lineplot';
    const input_variables = '\n@test_line____x = @x\n@test_line____y = @y\n';
    const plot_variables = '@lineplot____xdomain = [ min( concat( @test_line____x)), max( concat( @test_line____x)) ]\n@lineplot____ydomain = [ min( concat( @test_line____y)), max( concat( @test_line____y)) ]';
    const selected_plot = selectPlot(fake_state, fake_plot_id, {});
    expect(selected_plot.plotScript).toEqual('\n' + plot.script + input_variables + plot_variables);
  });
});
             