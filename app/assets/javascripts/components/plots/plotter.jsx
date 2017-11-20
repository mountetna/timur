import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectManifest } from '../../actions/manifest_actions';
import { requestConsignments, requestManifests, manifestToReqPayload } from '../../actions/manifest_actions';
import { selectConsignment } from '../../selectors/consignment';
import { saveNewPlot, deletePlot, savePlot, selectPlot, toggleEditing } from '../../actions/plot_actions';
import { getAllPlots, getSelectedPlot } from '../../selectors/plot';
import { getSelectedManifest, isEmptyManifests, getEditableManifests } from '../../selectors/manifest';
import ListMenu from '../list_menu';
import ButtonBar from '../button_bar';
import ScatterPlotForm from './scatter_plot_form';
import Plot from './plotly';

class Plotter extends Component {
  constructor() {
    super();

    this.state = {
      // track requested consignments so that another request is not made for the same consignment
      requestedConsignments: new Set()
    };
  }

  componentDidMount() {
    const { isEmptyManifests, plotableManifests, selectedManifest, requestManifests, consignment } =  this.props;

    if (isEmptyManifests) {
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
    const { selectedManifest, consignment, plotableManifests, isEmptyManifests } = nextProps;

    if (!selectedManifest && !isEmptyManifests) {
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

  selectPlot(plot_id) {
    let plot = this.props.plots.find(p => p.id == plot_id);
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

    let buttons = [
      {
        label: 'edit',
        click: toggleEditing.bind(this),
        icon: 'pencil-square-o'
      },
      {
        click: this.handleDelete.bind(this),
        icon: 'trash-o',
        label: 'delete'
      }
    ];

    return (
      <div className='plot-container'>
        <div>
        <ListMenu
          name='Plot'
          create={ this.newPlot.bind(this) }
          select={ this.selectPlot.bind(this) }
          items={ plots }/>
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
                  {
                    selectedPlot.is_editable && <ButtonBar className='actions' buttons={ buttons }/>
                  }
                  <Plot plot={selectedPlot} consignment={consignment || {}} />
                </div>
              }
            </div>
          )}
      </div>
    );
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
  };
};

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
)(Plotter);
