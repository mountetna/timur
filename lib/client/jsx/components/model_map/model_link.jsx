import React from 'react';

const dist = (p1,p2) => Math.sqrt( (p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) )

const ModelLink = ({ center, parent, size }) => {
  if (!parent || !center) return null;

  let scale = (size) / dist(center, parent);

  return <g className="model_link">
    <line
      x2={(center.x+(parent.x-center.x)*scale)}
      y2={center.y-size/2}
      x1={parent.x}
      y1={parent.y} markerEnd="url(#arrow)"/>
  </g>;
}

export default ModelLink;
