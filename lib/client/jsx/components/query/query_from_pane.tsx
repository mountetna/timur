import React, {useCallback, useContext} from 'react';

import {QueryGraphContext} from '../../contexts/query/query_graph_context';
import {QueryColumnContext} from '../../contexts/query/query_column_context';
import QueryModelSelector from './query_model_selector';
import QueryClause from './query_clause';

const QueryFromPane = () => {
  const {
    state: {graph, rootModel},
    setRootModel
  } = useContext(QueryGraphContext);
  const {setRootIdentifierColumn} = useContext(QueryColumnContext);

  const onRootModelSelect = useCallback(
    (modelName: string) => {
      let template = graph.template(modelName);
      setRootModel(modelName);
      setRootIdentifierColumn({
        model_name: modelName,
        attribute_name: template.identifier,
        display_label: `${modelName}.${template.identifier}`,
        slices: []
      });
    },
    [graph, setRootModel, setRootIdentifierColumn]
  );

  return (
    <QueryClause title='From'>
      <QueryModelSelector
        label='Root Model'
        modelValue={rootModel || ''}
        modelChoiceSet={[...graph.allowedModels]}
        onSelectModel={(modelName) => onRootModelSelect(modelName)}
        canRemove={false}
        removeModel={() => {}}
      />
    </QueryClause>
  );
};

export default QueryFromPane;
