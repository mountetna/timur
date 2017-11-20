import React, { Component } from 'react'
import Plot from './plotly'
import ButtonBar from '../button_bar'
import  InputField from './input_field'
import Vector from '../../models/vector'

class ScatterPlotForm extends Component {
  constructor(props) {
    super(props);
    this.plotType = 'scatter';

    // set default configuration
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
    };
  }

  componentDidMount() {
    if (this.props.plot) {
      // load configuration from selected plot
      this.setState(this.props.plot.configuration);
    }
  }

  componentWillReceiveProps(nextProps) {
    // clear the data when the manifest changes
    if (nextProps.selectedManifest != this.props.selectedManifest) {
      this.setState({ data: [] });
    }

    // update plotable data when consignment changes
    if (nextProps.consignment != this.props.consignment) {
      this.setState({ plotableData: nextProps.consignment ? this.plotableDataSeries(nextProps.consignment) : {} });
    }

    // update plot configuration if plot is selected
    if (nextProps.plot) {
      this.setState(this.props.plot.configuration);
    }
  }

  // only allow vector elements to be selected
  plotableDataSeries(consignment = {}) {
    return Object.keys(consignment).reduce( (acc, key) => {
      if (consignment[key] instanceof Vector) {
        return { ...acc, [key]: consignment[key] };
      }
      return acc;
    },{});
  }

  // add the data series that has x and y data series references to the configuration and add data from consignment
  addSeries(series) {
    const withSeriesData = {
      ...series,
      id: Math.random(),
      x: this.state.plotableData[series.x].values,
      manifestSeriesX: series.x,
      y: this.state.plotableData[series.y].values,
      manifestSeriesY: series.y
    };

    this.setState({
      data: [...this.state.data, withSeriesData]
    });
  }

  // remove series from data by Id
  removeSeries(seriesId) {
    const filteredData = this.state.data.filter(series => series.id != seriesId);
    this.setState({ data: filteredData });
  }

  updateTitle(title) {
    this.setState({ layout: { ...this.state.layout, title }});
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
    });
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
    });
  }

  updateHeight(height) {
    this.setState({layout: {...this.state.layout, height: height}});
  }

  updateWidth(width) {
    this.setState({layout: {...this.state.layout, width: width}});
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
    });
  }

  manifestOptions(manifests) {
    return manifests.map(manifest => (
      <option key={manifest.id} value={manifest.id}>{manifest.name}</option>
    ));
  }

  handleSave() {
    let plotConfig = {
      ...this.state,
      plotType: this.plotType, // add plot type
      data: this.state.data.map(seriesData => { // remove actual consignment data
        delete seriesData.x
        delete seriesData.y
        return seriesData
      })
    };
    delete plotConfig.plotableData; // remove UI options

    if (this.props.plot) { // update a selected plot
      const { manifest_id, id } = this.props.plot;
      this.props.savePlot(
        manifest_id,
        id,
        plotConfig,
        (plot) => {
          this.props.toggleEditing();
          this.props.selectPlot(plot);
        }
      );
    } else { // create a new plot
      this.props.saveNewPlot(
        this.props.selectedManifest.id,
        plotConfig,
        (plot) => {
          this.props.toggleEditing();
          this.props.selectPlot(plot);
        }
      );
    }
  }

  render () {
    const { layout, plotableData, data } = this.state;
    const { toggleEditing, selectedManifest, selectManifest, manifests, consignment, plot } = this.props;
    
    return (
      <div className='plot-form-container'>
        <ButtonBar className='actions' buttons={ [
          {
            click: this.handleSave.bind(this),
            icon: 'floppy-o',
            label: 'save'
          },
          {
            click: () => this.props.toggleEditing(false),
            icon: 'ban',
            label: 'cancel'
          }
        ]} />
        {'Manifest: '}
        {plot ? (
          <span>{selectedManifest.name}</span>
        ) : (
          <select
            value={selectedManifest ? selectedManifest.id : null}
            onChange={e => selectManifest(parseInt(e.target.value))}
          >
            {this.manifestOptions(manifests)}
          </select>
        )}
        <fieldset>
          <legend>Scatter Plot</legend>
          <InputField type='text' label='Title: '
            onChange={this.updateTitle.bind(this)}
            value={layout.title}
          />
          <InputField type='text' label='X Axis Label: '
            onChange={this.updateXAxisLabel.bind(this)}
            value={layout.xaxis.title}
          />
          <InputField type='text' label='Y Axis Label: '
            onChange={this.updateYAxisLabel.bind(this)}
            value={layout.yaxis.title}
          />
          <InputField type='text' label='height: '
            onChange={this.updateHeight.bind(this)}
            value={layout.height}
          />
          <InputField type='text' label='width: '
            onChange={this.updateWidth.bind(this)}
            value={layout.width}
          />
          <div className='input-container'>
            <label htmlFor='grid'>Grid: </label>
            <input id='grid' type='checkbox'
              checked={layout.xaxis.showgrid && layout.yaxis.showgrid}
              onChange={this.toggleGrid.bind(this)}
            />
          </div>
          <SeriesForm
            data={plotableData}
            addSeries={this.addSeries.bind(this)}
            appliedSeries={data}
            removeSeries={this.removeSeries.bind(this)}
          />
        </fieldset>
        <Plot
          plot={this.state}
          consignment={consignment}
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
    };
  }

  componentDidMount() {
    this.setDefaultXY(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data != nextProps.data) {
      this.setDefaultXY(nextProps);
    }
  }

  setDefaultXY(props) {
    const firstDataSeriesName = Object.keys(props.data)[0] || null;
    this.setState({
      x: firstDataSeriesName,
      y: firstDataSeriesName
    });
  }

  updateMode(evt) {
    this.setState({ mode: evt.target.value });
  }

  updateName(name) {
    this.setState({ name });
  }

  updateX(evt) {
    this.setState({ x: evt.target.value });
  }

  updateY(evt) {
    this.setState({ y: evt.target.value });
  }

  appliedSeries(plottedSeries) {
    return plottedSeries.map(series => (
      <li key={series.id}>
        {series.name + ' '}
        <i className='fa fa-times' aria-hidden='true'
           onClick={() => this.props.removeSeries(series.id)}>
        </i>
      </li>
    ));
  }

  seriesOptions(seriesMap) {
    return Object.keys(seriesMap).map((key) => (
      <option key={key} value={key}>{key}</option>
    ));
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

export default ScatterPlotForm;
