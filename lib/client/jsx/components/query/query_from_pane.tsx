import React, {useCallback, useContext} from 'react';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {QueryGraphContext} from '../../contexts/query/query_graph_context';
import {QueryColumnContext} from '../../contexts/query/query_column_context';
import QueryModelSelector from './query_model_selector';
import QueryClause from './query_clause';

import useUriQueryParams from '../../contexts/query/use_uri_query_params';

const QueryFromPane = () => {
  const {
    state: {graph, rootModel},
    setRootModel
  } = useContext(QueryGraphContext);
  const {setRootIdentifierColumn} = useContext(QueryColumnContext);

  let reduxState = useReduxState();

  const onRootModelSelect = useCallback(
    (modelName: string) => {
      let template = selectTemplate(reduxState, modelName);
      setRootModel(modelName);
      setRootIdentifierColumn({
        model_name: modelName,
        attribute_name: template.identifier,
        display_label: `${modelName}.${template.identifier}`,
        slices: []
      });
    },
    [reduxState, setRootModel, setRootIdentifierColumn]
  );

  // useUriQueryParams(state, patchState);

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
