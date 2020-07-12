import React from 'react';

const ModelNode = ({ model_name, center, size, selected, handler }) =>
  center ?
  <div className={ `model_node ${selected == model_name ? 'selected' : ''}` }
    style={ { top: center.y, left: center.x} } onClick={ () => handler(model_name) }>
      { model_name }
  </div> : null;

export default ModelNode;
