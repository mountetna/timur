// Framework libraries.
import * as React from 'react';
import { connect } from 'react-redux';

import DocumentWindow from '../document/document_window';
import ListMenu from '../list_menu';
import Dropdown from '../dropdown';
import ManifestScript from '../manifest/manifest_script';
import ConsignmentView from '../manifest/consignment_view';
import PlotLayout from './plot_layout';
import PlotSeries from './plot_series';
import Plot, {PLOTS} from '../plots/plot';
import Resize from '../resize';

import { pushLocation } from '../../actions/location_actions';
import {
  requestPlots,
  selectPlot,
  saveNewPlot,
  savePlot,
  deletePlot
} from '../../actions/plot_actions';

import {
  newPlot,
  getAllPlots,
  getSelectedPlot,
  plotWithScript
} from '../../selectors/plot_selector';
import {
  MD5,
  getLoadedConsignmentIds
} from '../../selectors/consignment_selector';
import {
  isEmptyManifests,
  getEditableManifests
} from '../../selectors/manifest_selector';
// the basic plotter interface
//
// basics:
// plot name & buttons
// plot details
//
// script selection:
// edit view:
// import manifest script
// edit script
// view consignment
//
// layout
//  height
//  margin: top right left bottom
//
// series
//  + add
//  - remove
//  type
//  series vars, e.g. x y color
const PLOT_TYPES = Object.keys(PLOTS).sort();

const SelectPlot = ({update, selected}) =>
  <div className='select-plot'>
    <Dropdown
      default_text='Select Plot'
      list={ PLOT_TYPES }
      onSelect={ index=>{
        update(PLOT_TYPES[index]);
      }}
      selected_index={PLOT_TYPES.indexOf(selected)}
    />
  </div>;

const SeriesConfig = ({ label, series_types, updateType, updateSeries, plot_series }) =>
  <div className='wrapper'>
    <div className='pc-wrapper left'>
      <div className='pc-header-title-text'>{label}</div>
      <div>
        <Dropdown
          default_text='Add Series'
          list={series_types.map(series => series.type)}
          onSelect={index => {
            let new_series = {
              series_type: series_types[index].type,
              variables: {},
              name: null
            };
            updateSeries([
              new_series,
              ...(plot_series || [])
            ]);
          }}
          selected_index={null}
        />
      </div>
    </div>
    <div className='pc-wrapper right'>
      <div>
        <i
          onClick={() => {
            updateType(null);
            updateSeries([]);
          }}
          className='fa fa-lg'
        >
          &times;
        </i>
      </div>
    </div>
  </div>;

class Plotter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_plot_index: null,
      selected_plot_series_index: null,
      plot: null,
      unsaved_plots: {},
      new_plot_series_counter: 0
    };
  }

  componentDidMount() {
    this.props.requestPlots();
  }

  componentDidUpdate() {
    let { plot_id, plots } = this.props;
    let { plot } = this.state;

    if (plot_id && plots && !plot) this.selectPlot(plot_id, false);
  }

  createPlot() {
    this.selectPlot('new', true);
  }

  setPlot({ plot }) {
    this.selectPlot(plot.id);
  }

  selectPlot(id, push=true) {
    let { plots, pushLocation } = this.props;
    let plot;

    switch(id) {
      case 'new':
        plot = newPlot()
        break;
      case null:
        plot = null;
        break;
      default:
        // find it in the existing manifests
        plot = plots.find(p => p.id == id);
        if (!plot) return;

        // copy it so you don't modify the store
        plot = { ...plot };
        break;
    }

    this.setState({
      plot,
      md5sum: plot ? MD5(plot.script) : null,
      editing: id == 'new'
    });

    if (push) pushLocation(
      id == null ?
      Routes.plots_path(TIMUR_CONFIG.project_name) :
      Routes.plot_path(TIMUR_CONFIG.project_name, id)
    );
  }

  updateField(field_name) {
    return event => {
      let { plot, md5sum } = this.state;
      let new_md5sum;

      if (field_name == 'script') {
        // the code editor does not emit an event, just the new value
        plot.script = event;
        new_md5sum = MD5(plot.script);
      } else {
        plot[field_name] = event.target.value;
      }
      this.setState({ plot, md5sum: new_md5sum || md5sum });
    };
  }

  updatePlotField(field_name) {
    return value => {
      let { plot } = this.state;
      plot[field_name] = value;
      this.setState({ plot });
    };
  }

  updatePlotConfiguration(field_name) {
    return value => {
      let { plot } = this.state;
      let new_configuration = { ...plot.configuration, [field_name]: value };
      this.updatePlotField('configuration')(new_configuration);
    };
  }

  savePlot() {
    let { plot, editing } = this.state;
    // A new plot should have an id set to 0.
    if (plot.id <= 0) this.props.saveNewPlot(plot, this.setPlot.bind(this));
    else this.props.savePlot(plot);

    if (editing) this.toggleEdit();
  }

  toggleEdit() {
    this.setState({
      editing: !this.state.editing
    });
  }

  copyPlot() {
    let { manifest } = this.state;
    this.props.copyManifest(manifest, this.setManifest.bind(this));
  }

  deletePlot() {
    let { plot } = this.state;
    if (confirm('Are you sure you want to remove this plot?')) {
      this.props.deletePlot(plot, () => this.selectPlot(0));
    }
  }

  revertPlot() {
    let { plot: { id }, editing } = this.state;

    if (id > 0) this.selectPlot(id);
    else this.selectPlot(null);

    if (editing) this.toggleEdit();
  }

  renderEditor() {
    let { plot } = this.state;
    let plot_config = PLOTS[plot.plot_type];

    return (
      <div>
        Manifest
        <ManifestScript
          script={plot.script}
          is_editing={true}
          onChange={this.updateField.bind(this)('script')}
        />
        <br />
        <span className='section-header'>layout </span>
        <br />
        <PlotLayout
          layout={plot.configuration.layout}
          onChange={this.updatePlotConfiguration('layout')}
        />
        <br />
        <span className='section-header'>Plot Type </span>
        <br />
        {plot_config ? (
          <SeriesConfig
            label={plot_config.label}
            series_types={ plot_config.series_types }
            updateType={this.updatePlotField('plot_type')}
            updateSeries={ this.updatePlotConfiguration('plot_series')}
            plot_series={plot.configuration.plot_series}
          />
        ) : (
          <SelectPlot update={ this.updatePlotField('plot_type') } selected={ plot.plot_type }/>
        )}
        <div className='ps-list-container'>
          {plot.configuration.plot_series && plot.configuration.plot_series.map((series, index) => (
            <PlotSeries
              key={`ps-card-container-${index}`}
              plot_series={series}
              series_config={plot_config.series_types.find(
                s => s.type == series.series_type
              )}
              onDelete={() => {
                let new_plot_series = plot.configuration.plot_series.slice(0);
                new_plot_series.splice(index, 1);
                this.updatePlotConfiguration('plot_series')(new_plot_series);
              }}
              onChange={(name, value) => {
                let new_plot_series = plot.configuration.plot_series.slice(0);
                new_plot_series[index] = { ...series, [name]: value };
                this.updatePlotConfiguration('plot_series')(new_plot_series);
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  renderPlot() {
    let { plot } = this.state;

    return (
      <div className='chart'>
        <Resize
          render={width => (
            <Plot plot={plotWithScript([plot, {}])} width={width} />
          )}
        />
      </div>
    );
  }
  render() {
    // Variables.
    let { plots } = this.props;

    let { plot, editing, md5sum } = this.state;

    return (
      <DocumentWindow
        editing={editing}
        document={plot}
        documents={plots}
        documentType='plot'
        onUpdate={this.updateField.bind(this)}
        onEdit={this.toggleEdit.bind(this)}
        onCancel={this.revertPlot.bind(this)}
        onSave={this.savePlot.bind(this)}
        onCopy={this.copyPlot.bind(this)}
        onRemove={this.deletePlot.bind(this)}
        onCreate={this.createPlot.bind(this)}
        onSelect={this.selectPlot.bind(this)}
      >
        {editing ? this.renderEditor() : this.renderPlot()}
      </DocumentWindow>
    );
  }
}

export default connect(
  (state) => ({
    plots: getAllPlots(state)
  }),
  {
    requestPlots,
    selectPlot,
    saveNewPlot,
    savePlot,
    deletePlot,
    pushLocation
  }
)(Plotter);
