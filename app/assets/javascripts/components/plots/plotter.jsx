import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectManifest } from '../../actions/manifest_actions'
import { requestConsignments } from '../../actions/consignment_actions'
import { requestManifests, manifestToReqPayload } from '../../actions/manifest_actions'
import { selectConsignment } from '../../selectors/consignment'
import { saveNewPlot, deletePlot, savePlot, selectPlot, toggleEditing } from '../../actions/plot_actions'
import { getAllPlots, getSelectedPlot } from '../../selectors/plot'
import { getSelectedManifest, isEmptyManifests, getEditableManifests } from '../../selectors/manifest'
import ScatterPlotForm from './scatter_plot_form'
import Plot from './plotly'

class Plotter extends Component {
  constructor() {
    super();

    this.state = {
      // track requested consignments so that another request is not made for the same consignment
      requestedConsignments: new Set()
    };
  }

  componentDidMount() {
    const { shouldReqManifests, plotableManifests, selectedManifest, requestManifests, consignment } =  this.props;

    if (shouldReqManifests) {
      // request manifests during initial page load
      requestManifests();
    } else if (!selectedManifest) {
      // select a manifest if not already selected
      this.selectDefaultManifest(plotableManifests);
    }

    // get consignment for manifest
    if (!consignment && selectedManifest && !this.state.requestedConsignments.has(selectedManifest.name)) {
      this.requestConsignment(selectedManifest);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectedManifest, consignment, plotableManifests } = nextProps;

    if (!selectedManifest) {
      // select a manifest if not already selected
      this.selectDefaultManifest(plotableManifests);
    }

    // get consignment for manifest if needed
    if (!consignment && selectedManifest && !this.state.requestedConsignments.has(selectedManifest.name)) {
      this.requestConsignment(selectedManifest);
    } else if (consignment && selectedManifest) {
      // remove from requestedConsignments if exists
      let updatedSet = new Set(this.state.requestedConsignments);
      updatedSet.delete(selectedManifest.name);
      this.setState({ requestedConsignments: updatedSet });
    }
  }

  // select the first manifest
  selectDefaultManifest(manifests) {
    this.props.selectManifest(manifests[0] ? manifests[0].id : null);
  }

  // request consignment for manifest and add to requestedConsignments
  requestConsignment(manifest) {
    this.setState(
      { requestedConsignments: (new Set(this.state.requestedConsignments)).add(manifest.name) },
      () => {
        const reqPayload = manifestToReqPayload(manifest);
        this.props.requestConsignments([reqPayload]);
      }
    );
  }

  newPlot() {
    this.props.selectPlot(null);
    this.props.toggleEditing(true);
  }

  selectPlot(plot) {
    this.props.selectManifest(plot.manifest_id);
    this.props.selectPlot(plot.id);
    this.props.toggleEditing(false);
  }

  handleDelete() {
    this.props.deletePlot(
      this.props.selectedManifest.id,
      this.props.selectedPlot.id,
      () => this.props.selectPlot(null)
    );
  }

  plotList(plots) {
    return plots.map(plot => {
      return (
        <li key={plot.id}>
          <a onClick={() => this.selectPlot(plot)}>
            {plot.name}
          </a>
        </li>
      );
    });
  }

  render() {
    const {
      isEditing,
      plots,
      consignment,
      selectManifest,
      selectedManifest,
      saveNewPlot,
      plotableManifests,
      toggleEditing,
      selectedPlot,
      savePlot
    } = this.props;

    return (
      <div className='plot-container'>
        <div>
          Plots
          <div>
            <a onClick={this.newPlot.bind(this)}>new plot</a>
          </div>
          <ul>{this.plotList(plots)}</ul>
        </div>
          {isEditing ? (
            <ScatterPlotForm className='plot-form'
              consignment={consignment || {}}
              selectedManifest={selectedManifest}
              selectManifest={selectManifest}
              saveNewPlot={saveNewPlot}
              manifests={plotableManifests}
              toggleEditing={toggleEditing}
              selectPlot={this.selectPlot.bind(this)}
              plot={selectedPlot}
              savePlot={savePlot}
            />
          ) : (
            <div>
              {selectedPlot &&
                <div>
                  {selectedPlot.is_editable &&
                    <div>
                      <a onClick={this.handleDelete.bind(this)}>delete </a>
                      <a onClick={toggleEditing.bind(this)}>edit</a>
                    </div>
                  }
                  <Plot plot={selectedPlot} consignment={consignment || {}} />
                </div>
              }
            </div>
          )}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const selectedManifest = getSelectedManifest(state);

  let consignment = null;
  if (selectedManifest) {
    consignment = selectConsignment(state, selectedManifest.name);
  }

  return {
    consignment,
    selectedManifest,
    isEmptyManifests: isEmptyManifests(state),
    plotableManifests: getEditableManifests(state),
    plots: getAllPlots(state),
    selectedPlot: getSelectedPlot(state),
    isEditing: state.plots.isEditing,
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
