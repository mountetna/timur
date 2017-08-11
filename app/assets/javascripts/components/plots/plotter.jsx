import React, { Component } from 'react'
import createPlotlyComponent from 'react-plotlyjs'
import  Plotly from 'plotly.js/lib/core'
import { connect } from 'react-redux'
import  InputField from '../manifest/input_field'
import { selectManifest } from '../../actions/manifest_actions'
import { requestConsignments } from '../../actions/consignment_actions'
import { requestManifests, manifestToReqPayload } from '../../actions/manifest_actions'
import { selectConsignment } from '../../selectors/consignment'
import Vector from '../../vector'
import { saveNewPlot, deletePlot, savePlot, selectPlot, toggleEditing } from '../../actions/plot_actions'
import { allPlots } from '../../reducers/plots_reducer'

Plotly.register([
  require('plotly.js/lib/scatter')
])
const PlotlyComponent = createPlotlyComponent(Plotly)

class Plotter extends Component {
  componentWillMount() {
    const { manifests, selectedManifest, requestManifests, consignment, selectManifest } =  this.props
    const isEmptyManifestMap = !Object.keys(manifests)[0]

    if (isEmptyManifestMap) {
      requestManifests()
    }

    if (!selectedManifest) {
      selectManifest(Object.keys(manifests)[0] || null)
    }

    if (!consignment && selectedManifest && manifests[selectedManifest]) {
      const manifest = manifests[selectedManifest]
      const reqPayload = manifestToReqPayload(manifest)
      requestConsignments([reqPayload])
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.manifests && !this.props.selectedManifest) {
      this.props.selectManifest(Object.keys(nextProps.manifests)[0] || null)
    }

    if (!this.props.selectedManifest ||
      (this.props.selectedManifest != nextProps.selectedManifest && !nextProps.consignment)) {

      if (this.props.manifests[nextProps.selectedManifest]) {
        const manifest = this.props.manifests[nextProps.selectedManifest]
        const reqPayload = manifestToReqPayload(manifest)
        this.props.requestConsignments([reqPayload])
      }
    }
  }

  newPlot() {
    this.props.selectPlot(null)
    this.props.toggleEditing(true)
  }

  selectPlot(id) {
    this.props.selectManifest(this.props.plots.find(plot => plot.id === id).manifest_id)
    this.props.selectPlot(id)
    this.props.toggleEditing(false)
  }

  handleDelete() {
    this.props.deletePlot(
      this.props.selectedManifest,
      this.props.selectedPlot,
      () => this.props.selectPlot(null)
    )
  }

  render() {
    return (
      <div className='plot-container'>
        <div>
          Plots
          <div>
            <a onClick={() => this.newPlot()}>new plot</a>
          </div>
          <ul>
            {this.props.plots.map(plot => (
              <li key={plot.id}>
                <a onClick={() => this.selectPlot(plot.id)}>
                  {plot.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
          {this.props.isEditing ? (
            <ScatterPlotForm className='plot-form'
              consignment={this.props.consignment}
              selectedManifest={this.props.selectedManifest}
              selectManifest={this.props.selectManifest}
              saveNewPlot={this.props.saveNewPlot}
              manifests={this.props.manifests}
              toggleEditing={this.props.toggleEditing}
              selectPlot={this.selectPlot.bind(this)}
              plot={this.props.plots.find(plot => plot.id === this.props.selectedPlot)}
              savePlot={this.props.savePlot}
            />
          ) : (
            <div>
              {this.props.selectedPlot &&
                <div>
                  <a onClick={this.handleDelete.bind(this)}>delete </a>
                  <a onClick={() => this.props.toggleEditing()}>edit</a>
                  <Plot
                    plot={this.props.plots.find(plot => plot.id === this.props.selectedPlot)}
                    consignment={this.props.consignment}
                  />
                </div>
              }
            </div>
          )}
      </div>
    )
  }
}

class Plot extends Component {
  componentDidMount() {
    this.updatePlot(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updatePlot(nextProps)
  }

  updatePlot(props) {
    if (props.plot && props.consignment) {
      this.setState(this.toPlotly(props.plot, props.consignment))
    }
  }

  toPlotly(plot, consignment = {}) {
    let plotType = plot ? plot.plot_type || plot.plotType :  ''
    switch (plotType) {
      case 'scatter':
        let plotly = plot.configuration ? { ...plot.configuration } : { ...plot }
        plotly.data = plotly.data.map(d => ({
          ...d,
          x: consignment[d.manifestSeriesX] ? consignment[d.manifestSeriesX].values : [],
          y: consignment[d.manifestSeriesY] ? consignment[d.manifestSeriesY].values : []
        }))
        return plotly
      default:
        return plot
    }
  }

  render() {
    return <PlotlyComponent { ...this.state } />
  }
}

const mapStateToProps = (state) => {
  const { manifests, manifestsUI, plots } = state
  let consignment = null
  if (manifests[manifestsUI.selected]) {
    consignment = selectConsignment(state, manifests[manifestsUI.selected].name)
  }

  return {
    manifests,
    consignment,
    selectedManifest: manifestsUI.selected,
    plots: allPlots(state.plots),
    selectedPlot: plots.selected,
    isEditing: plots.isEditing
  }
}

export default connect(
  mapStateToProps,
  {
    selectManifest,
    requestManifests,
    requestConsignments,
    saveNewPlot,
    deletePlot,
    savePlot,
    selectPlot,
    toggleEditing
  }
)(Plotter)

class ScatterPlotForm extends Component {
  constructor(props) {
    super(props)
    this.plotType = 'scatter',

    this.state = {
      data: [],
      layout: {
        width: 1600,
        height: 900,
        title: '',
        xaxis: {
          title: '',
          showline: true,
          showgrid: false,
          gridcolor: '#bdbdbd'
        },
        yaxis: {
          title: '',
          showline: true,
          showgrid: false,
          gridcolor: '#bdbdbd'
        }
      },
      config: {
        showLink: false,
        displayModeBar: true,
        modeBarButtonsToRemove: ['sendDataToCloud', 'lasso2d', 'toggleSpikelines']
      },
      plotableData: this.plotableDataSeries(props.consignment)
    }
  }

  componentDidMount() {
    if (this.props.plot) {
      this.setState(this.props.plot.configuration)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedManifest != this.props.selectedManifest) {
      this.setState({ data: [] })
    }

    if (nextProps.consignment != this.props.consignment) {
      this.setState({ plotableData: nextProps.consignment ? this.plotableDataSeries(nextProps.consignment) : {} })
    }

    if (nextProps.plot) {
      this.setState(this.props.plot.configuration)
    }
  }

  plotableDataSeries(consignment = {}) {
    return Object.keys(consignment).reduce( (acc, key) => {
      if (consignment[key] instanceof Vector) {
        return { ...acc, [key]: consignment[key] }
      }
      return acc
    },{})
  }

  addSeries(series) {
    const withSeriesData = {
      ...series,
      id: Math.random(),
      x: this.state.plotableData[series.x].values,
      manifestSeriesX: series.x,
      y: this.state.plotableData[series.y].values,
      manifestSeriesY: series.y
    }

    this.setState({
      data: [...this.state.data, withSeriesData]
    })
  }

  removeSeries(seriesId) {
    const filteredData = this.state.data.filter(series => series.id != seriesId)
    this.setState({ data: filteredData })
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

  updateHeight(height) {
    this.setState({layout: {...this.state.layout, height: height}})
  }

  updateWidth(width) {
    this.setState({layout: {...this.state.layout, width: width}})
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

  manifestOptions(manifests) {
    return Object.keys(manifests).map(key => (
      <option key={key} value={key}>{manifests[key].name}</option>
    ))
  }

  handleSave() {
    let plotConfig = {
      ...this.state,
      plotType: this.plotType,
      data: this.state.data.map(seriesData => {
        delete seriesData.x
        delete seriesData.y
        return seriesData
      })
    }
    delete plotConfig.plotableData
    if (this.props.plot) {
      const { manifest_id, id } = this.props.plot
      this.props.savePlot(
        manifest_id,
        id,
        plotConfig,
        (plot) => {
          console.log(this.props)
          this.props.toggleEditing()
          this.props.selectPlot(plot.id)
        }
      )
    } else {
      this.props.saveNewPlot(
        this.props.selectedManifest,
        plotConfig,
        (plot) => {
          this.props.toggleEditing()
          this.props.selectPlot(plot.id)
        }
      )
    }

  }

  render () {
    const { layout } = this.state

    return (
      <div className='plot-form-container'>
        <div>
          <a onClick={this.handleSave.bind(this)}>save </a>
          <a onClick={() => this.props.toggleEditing()}>cancel</a>
        </div>
        {'Manifest: '}
        {this.props.plot ? (
          <span>{this.props.manifests[this.props.selectedManifest].name}</span>
        ) : (
          <select value={this.props.selectedManifest} onChange={(e) => this.props.selectManifest(e.target.value)}>
            {this.manifestOptions(this.props.manifests)}
          </select>
        )}
        <fieldset>
          <legend>Scatter Plot</legend>
          <InputField type='text' label='Title: ' onChange={this.updateTitle.bind(this)} value={layout.title} />
          <InputField type='text' label='X Axis Label: ' onChange={this.updateXAxisLabel.bind(this)} value={layout.xaxis.title} />
          <InputField type='text' label='Y Axis Label: ' onChange={this.updateYAxisLabel.bind(this)} value={layout.yaxis.title} />
          <InputField type='text' label='height: ' onChange={this.updateHeight.bind(this)} value={layout.height} />
          <InputField type='text' label='width: ' onChange={this.updateWidth.bind(this)} value={layout.width} />
          <div className='input-container'>
            <label htmlFor='grid'>Grid: </label>
            <input id='grid' type='checkbox' checked={layout.xaxis.showgrid && layout.yaxis.showgrid} onChange={this.toggleGrid.bind(this)} />
          </div>
          <SeriesForm
            data={this.state.plotableData}
            addSeries={this.addSeries.bind(this)}
            appliedSeries={this.state.data}
            removeSeries={this.removeSeries.bind(this)}
            selectedManifest={this.props.selectedManifest}
          />
        </fieldset>
        <Plot
          plot={this.state}
          consignment={this.props.consignment}
        />
      </div>
    )
  }
}

class SeriesForm extends Component {
  constructor() {
    super()
    this.state = {
      type: 'scatter',
      x: null,
      y: null,
      mode: 'markers',
      name: ''
    }
  }

  componentDidMount() {
    this.setDefaultXY(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data != nextProps.data) {
      this.setDefaultXY(nextProps)
    }
  }

  setDefaultXY(props) {
    const firstDataSeriesName = Object.keys(props.data)[0] || null
    this.setState({
      x: firstDataSeriesName,
      y: firstDataSeriesName
    })
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

  appliedSeries(plottedSeries) {
    return plottedSeries.map(series => (
      <li key={series.id}>
        {series.name + ' '}
        <i className='fa fa-times' aria-hidden='true'
           onClick={() => this.props.removeSeries(series.id)}>
        </i>
      </li>
    ))
  }

  seriesOptions(seriesMap) {
    return Object.keys(seriesMap).map((key) => (
      <option key={key} value={key}>{key}</option>
    ))
  }

  render() {
    return (
      <fieldset style={{ marginBottom: 10 }}>
        <legend>Series</legend>
        <ol>
          {this.appliedSeries(this.props.appliedSeries)}
        </ol>
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
              {this.seriesOptions(this.props.data)}
            </select>
          </label>
        </div>
        <div className='input-container'>
          <label>
            {'Y: '}
            <select value={this.state.y} onChange={this.updateY.bind(this)}>
              {this.seriesOptions(this.props.data)}
            </select>
          </label>
        </div>
        <input type='button' value='Add Series' onClick={() => this.props.addSeries(this.state)} />
      </fieldset>
    )
  }
}
