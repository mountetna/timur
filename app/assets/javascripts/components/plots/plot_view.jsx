import React from 'react';
import ButtonBar from '../button_bar';
import Plot from './plot';

const PlotView = ({ selectedPlot, consignment, toggleEditing, handleDelete }) => {
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
      {selectedPlot.is_editable && <ButtonBar className='actions' buttons={ buttons } />}
      <Plot plot={selectedPlot} consignment={consignment} />
    </div>
  );
};

export default PlotView