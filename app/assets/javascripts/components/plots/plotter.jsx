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
import { saveNewPlot } from '../../actions/plot_actions'

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

    if (nextProps.selectedManifest && !nextProps.consignment) {
      if (this.props.manifests[nextProps.selectedManifest]) {
        const manifest = this.props.manifests[nextProps.selectedManifest]
        const reqPayload = manifestToReqPayload(manifest)
        this.props.requestConsignments([reqPayload])
      }
    }
  }

  manifestOptions(manifests) {
    return Object.keys(manifests).map(key => (
      <option key={key} value={key}>{manifests[key].name}</option>
    ))
  }

  render() {
    return (
      <div className='plot-container'>
        <select value={this.props.selectedManifest} onChange={(e) => this.props.selectManifest(e.target.value)}>
          {this.manifestOptions(this.props.manifests)}
        </select>
        <ScatterPlotForm className='plot-form'
          consignment={this.props.consignment || {}}
          manifestId={this.props.selectedManifest}
          saveNewPlot={this.props.saveNewPlot}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { manifests, manifestsUI: { selected } } = state
  let consignment = null
  if (manifests[selected]) {
    consignment = selectConsignment(state, manifests[selected].name)
  }

  return {
    manifests,
    consignment,
    selectedManifest: selected
  }
}

export default connect(
  mapStateToProps,
  { selectManifest, requestManifests, requestConsignments, saveNewPlot }
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.manifestId != this.props.manifestId) {
      this.setState({ data: [] })
    }

    if (nextProps.consignment != this.props.consignment) {
      this.setState({ plotableData: nextProps.consignment ? this.plotableDataSeries(nextProps.consignment) : {} })
    }
  }

  plotableDataSeries(consignment) {
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
    this.props.saveNewPlot(this.props.manifestId, plotConfig)
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
          <InputField type='text' label='height: ' onChange={this.updateHeight.bind(this)} value={layout.height} />
          <InputField type='text' label='width: ' onChange={this.updateWidth.bind(this)} value={layout.width} />
          <div className='input-container'>
            <label htmlFor='grid'>Grid: </label>
            <input id='grid' type='checkbox' checked={layout.xaxis.showgrid && layout.yaxis.showgrid} onChange={this.toggleGrid.bind(this)} />
          </div>
          <input value='save' type='button' onClick={this.handleSave.bind(this)} />
          <SeriesForm
            data={this.state.plotableData}
            addSeries={this.addSeries.bind(this)}
            appliedSeries={this.state.data}
            removeSeries={this.removeSeries.bind(this)}
            selectedManifest={this.props.selectedManifest}
          />
        </fieldset>
        <PlotlyComponent { ...this.state } />
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

  componentWillReceiveProps(nextProps) {
    if (!this.props.selectedManifest || this.props.selectedManifest != nextProps.selectedManifest) {
      const firstDataSeriesName = Object.keys(nextProps.data)[0] || null
      this.setState({
        x: firstDataSeriesName,
        y: firstDataSeriesName
      })
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
