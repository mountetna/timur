import React, { Component } from 'react';
import ButtonBar from '../button_bar';
import Plot from './plot';

class PlotView extends Component {
  render() {
    const { selectedPlot, consignment, toggleEditing, handleDelete } = this.props;

    let buttons = [
      {
        label: 'edit',
        click: toggleEditing,
        icon: 'pencil-square-o'
      },
      {
        click: handleDelete,
        icon: 'trash-o',
        label: 'delete'
      }
    ];

    if (!selectedPlot) {
      return <div></div>;
    }

    return (
      <div>
        {selectedPlot.editable && <ButtonBar className='actions' buttons={ buttons } />}
        <Plot plot={selectedPlot} consignment={consignment} />
      </div>
    );
  }
}

export default PlotView;
