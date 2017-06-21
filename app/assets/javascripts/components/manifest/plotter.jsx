import React, { Component } from 'react'
import createPlotlyComponent from 'react-plotlyjs';
import  Plotly from 'plotly.js/lib/core'
import  InputField from './input_field'


Plotly.register([
  require('plotly.js/lib/scatter')
]);
const PlotlyComponent = createPlotlyComponent(Plotly);

export default class Plotter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editing: false,
      plot: {
        data: [],
        layout: {},
        config: {}
      },
    }
  }

  render() {
    console.log(this.props.data)
    let data = [
      {
        type: 'scatter',
        x: [1, 2, 3],
        y: [6, 2, 3],
        mode: 'markers',
      },
    ];
    let layout = {
      title: 'simple example',  // more about "layout.title": #layout-title
      xaxis: {                  // all "layout.xaxis" attributes: #layout-xaxis
        title: 'time',         // more about "layout.xaxis.title": #layout-xaxis-title
        showline: true,
        showgrid: true,
        gridwidth: 1,
        gridcolor: '#bdbdbd',
      },
      yaxis: {
        showline: true,
        showgrid: true,
        gridwidth: 1,
        gridcolor: '#bdbdbd',
      }
    };
    let config = {
      showLink: false,
      displayModeBar: true,
      modeBarButtonsToRemove: ['sendDataToCloud','lasso2d', 'toggleSpikelines']
    };
    return (
      <div>
        <div>
          <h1>Hello World!</h1>
          <ScatterPlotForm />
          <PlotlyComponent className="whatever" data={data} layout={layout} config={config} />
        </div>
      </div>
    )
  }
}

class ScatterPlotForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      layout: {
        title: '',
        xaxis: {
          title: '',
          showline: true,
          showgrid: false
        },
        yaxis: {
          title: '',
          showline: true,
          showgrid: false
        }
      },
      config: {
        showLink: false,
        displayModeBar: true,
        modeBarButtonsToRemove: ['sendDataToCloud','lasso2d', 'toggleSpikelines']
      }
    }
  }

  addSeries(series) {
    this.setState({
      data: [...this.state.data, series]
    })
  }

  updateTitle(title) {
    this.setState({ layout: { ...this.state.layout, title }})
  }

  updateXAxisLabel(label) {
    this.setState({
      layout: {
        ...this.state.layout,
        xaxis: {
          ...this.state.layout.xaxis,
          title: label
        }
      }
    })
  }

  updateYAxisLabel(label) {
    this.setState({
      layout: {
        ...this.state.layout,
        yaxis: {
          ...this.state.layout.yaxis,
          title: label
        }
      }
    })
  }

  toggleGrid() {
    this.setState({
      layout: {
        ...this.state.layout,
        xaxis: {
          ...this.state.layout.xaxis,
          showgrid: !this.state.layout.xaxis.showgrid
        },
        yaxis: {
          ...this.state.layout.yaxis,
          showgrid: !this.state.layout.yaxis.showgrid
        }
      }
    })
  }


  render () {
    const { layout } = this.state

    return (
      <div className='plot-form-container'>
        <fieldset>
          <legend>Scatter Plot</legend>
          <InputField type='text' label='Title: ' onChange={this.updateTitle.bind(this)} value={layout.title} />
          <InputField type='text' label='X Axis Label: ' onChange={this.updateXAxisLabel.bind(this)} value={layout.xaxis.title} />
          <InputField type='text' label='Y Axis Label: ' onChange={this.updateYAxisLabel.bind(this)} value={layout.yaxis.title} />
          <div className='input-container'>
            <label htmlFor='grid'>Grid: </label>
            <input id='grid' type='checkbox' checked={layout.xaxis.showgrid && layout.yaxis.showgrid} onChange={this.toggleGrid.bind(this)} />
          </div>
          <SeriesForm />
          <input type='button' value='Plot' />
        </fieldset>
      </div>
    )
  }
}

class SeriesForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      type: 'scatter',
      x: null,
      y: null,
      mode: 'markers',
      name: ''
    }
  }

  updateMode(evt) {
    this.setState({ mode: evt.target.value })
  }

  updateName(name) {
    this.setState({ name })
  }

  updateX(evt) {
    this.setState({ x: evt.target.value })
  }

  updateY(evt) {
    this.setState({ y: evt.target.value })
  }

  render() {
    return (
      <fieldset>
        <legend>Series</legend>
        <InputField type='text' label='Name: ' onChange={this.updateName.bind(this)} value={this.state.name} />
        <div className='input-container'>
          <label>
            {'Mode: '}
            <select value={this.state.mode} onChange={this.updateMode.bind(this)}>
              <option value='markers'>Markers</option>
              <option value='lines'>Lines</option>
              <option value='lines+markers'>Lines and Markers</option>
            </select>
          </label>
        </div>
        <div className='input-container'>
          <label>
            {'X: '}
            <select value={this.state.x} onChange={this.updateX.bind(this)}>
              <option value='markers'>Markers</option>
              <option value='lines'>Lines</option>
              <option value='lines+markers'>Lines and Markers</option>
            </select>
          </label>
        </div>
        <div className='input-container'>
          <label>
            {'Y: '}
            <select value={this.state.y} onChange={this.updateY.bind(this)}>
              <option value='markers'>Markers</option>
              <option value='lines'>Lines</option>
              <option value='lines+markers'>Lines and Markers</option>
            </select>
          </label>
        </div>
        <input type='button' value='Add Series' />
      </fieldset>
    )
  }


}
