import React from 'react';

import {selectModelNames, selectTemplate} from 'etna-js/selectors/magma';
import {useReduxState} from 'etna-js/hooks/useReduxState';
import ModelLink, {Arrowhead} from './model_link';
import ModelNode from './model_node';
import Layout from './tree_layout';

export default function ModelMapGraphic({
  current_model,
  handler,
  width,
  height
}) {
  width = width || 600;
  height = height || 600;

  let {model_names, templates} = useReduxState((state) => {
    let mod_names = selectModelNames(state);
    return {
      model_names: mod_names,
      templates: mod_names.map((model_name) =>
        selectTemplate(state, model_name)
      )
    };
  });

  let layout = new Layout(current_model, templates, width, height);

  return (
    <React.Fragment>
      <svg width={width} height={height}>
        <defs>
          <Arrowhead />
        </defs>
        {model_names.map((model_name) => {
          let node = layout.nodes[model_name];
          return (
            <ModelLink
              key={model_name}
              center={node.center}
              parent={
                node.model.parent && layout.nodes[node.model.parent]
                  ? layout.nodes[node.model.parent].center
                  : null
              }
              size={node.size}
            />
          );
        })}
      </svg>
      {model_names.map((model_name) => {
        let node = layout.nodes[model_name];

        return (
          <ModelNode
            key={model_name}
            center={node.center}
            size={node.size}
            selected={current_model}
            handler={handler}
            model_name={model_name}
          />
        );
      })}
    </React.Fragment>
  );
}
