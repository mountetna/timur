import React from 'react';
import { Animate } from 'react-move';
import { easeQuadIn } from 'd3-ease';

const nodeCenter = ({size, center}, parent_name, {nodes}) => ({
  size, center, parent: parent_name ? nodes[parent_name].center : null
});

const entryPoint = ({size,center,parent}, onRest) => ({
          size: [ size ],
          center: [ center ],
          parent: [ parent ],
          timing: { duration: 400, ease: easeQuadIn },
          events: onRest ? { end: onRest } : {}
});

const ModelAnimation = ({ model_name, layout, layout2, onRest, handler, ModelElement }) => {
  let node = layout.nodes[model_name];
  let node2 = layout2.nodes[model_name];

  let center = nodeCenter(node,node.parent_name,layout);
  let center2 = nodeCenter(node2,node2.parent_name,layout2);

  return <Animate
    start={ center }
    enter={ entryPoint(center2, onRest) }
    key={ model_name }>
    {
      ({center,size,parent}) =>
        <ModelElement
          handler={handler}
          key={model_name}
          size={ size }
          center={ center }
          parent={ parent }
          model_name={ model_name }/>
    }
  </Animate>
}

export default ModelAnimation;
