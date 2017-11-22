import React, { Component } from 'react';
import ScatterForm from './forms/scatter_plot';
import HeatmapForm from './forms/heatmap';

export default class PlotEditor extends Component {
  constructor(props) {
    super(props);

    if (this.isNewPlot()) {
      const manifestId = this.defaultManifestId();
      this.state = {
        plot: {
          plot_type: 'scatter',
          manifest_id: manifestId
        }
      };
    } else {
      this.state = { plot: {...props.plot} };
    }

    this.changePlotType = this.changePlotType.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.selectManifest = this.selectManifest.bind(this);
    this.updatePlot = this.updatePlot.bind(this);
  }

  componentDidMount() {
    if (this.isNewPlot()) {
      this.props.selectManifest(this.state.plot.manifest_id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.plot != nextProps.plot) {
      this.setState(nextProps.plot);
    }

    if (nextProps.selectedManifest != this.props.selectedManifest) {
      this.updateManifestId(nextProps.selectedManifest.id);
    }
  }

  componentDidUpdate() {}

  isNewPlot() {
    return !this.props.plot;
  }

  updateManifestId(manifest_id) {
    this.setState(prevSate => ({
      plot: {
        ...prevSate.plot,
        manifest_id
      }
    }));
  }

  defaultManifestId() {
    if (this.props.selectedManifest) {
      return this.props.selectedManifest.id;
    } else if (this.props.manifests[0]) {
      return this.props.manifests[0].id;
    } else {
      return null;
    }
  }

  changePlotType(plot_type) {
    this.setState(prevState => ({
      plot: {
        ...prevState.plot,
        plot_type
      }
    }));
  }

  selectManifest(manifest_id) {
    this.setState(
      prevState => ({
        plot: {
          ...prevState.plot,
          manifest_id
        }
      }),
      () => this.props.selectManifest(manifest_id)
    );
  }

  updatePlot(plotConfig) {
    this.setState({ plot: plotConfig });
  }

  handleSave() {
    if (this.isNewPlot()) {
      this.props.saveNewPlot({ ...this.state.plot });
    } else {
      this.props.savePlot({ ...this.state.plot });
    }
  }

  render() {
    const { toggleEditing, consignment, manifests, selectedManifest, selectManifest } = this.props;
    const props = {
      toggleEditing,
      manifests,
      selectedManifest,
      selectManifest,
      consignment,
      handleSave: this.handleSave,
      changePlotType: this.changePlotType,
      plot: { ...this.state.plot },
      isNewPlot: this.isNewPlot(),
      updatePlot: this.updatePlot

    };

    switch(this.state.plot.plot_type) {
      case 'heatmap':
        return <HeatmapForm {...props} />;
      default:
        return <ScatterForm {...props} />;
    }
  }
}