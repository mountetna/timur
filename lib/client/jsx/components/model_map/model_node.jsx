import React from 'react';

const ModelNode = ({ model_name, center, size, handler }) =>
  center ?
  <div className="model_node"
    style={ { top: center.y, left: center.x} } onClick={ () => handler(model_name) }>
      { model_name }
  </div> : null;

export default ModelNode;
