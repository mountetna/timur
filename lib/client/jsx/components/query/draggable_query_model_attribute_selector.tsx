import React from 'react';

import {Draggable} from 'react-beautiful-dnd';

import QueryModelAttributeSelector from './query_model_attribute_selector';

const DraggableQueryModelAttributeSelector = (props: any) => {
  return (
    <Draggable
      draggableId={`column-${props.columnIndex}`}
      index={props.columnIndex}
    >
      {(provided: any) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <QueryModelAttributeSelector {...props} />
        </div>
      )}
    </Draggable>
  );
};

export default DraggableQueryModelAttributeSelector;
