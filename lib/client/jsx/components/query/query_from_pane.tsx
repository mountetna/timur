import React, {useCallback, useContext} from 'react';
import {makeStyles} from '@material-ui/core/styles';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectTemplate} from 'etna-js/selectors/magma';

import {QueryContext} from '../../contexts/query/query_context';
import QueryModelSelector from './query_model_selector';
import QueryClause from './query_clause';

import useUriQueryParams from '../../contexts/query/use_uri_query_params';

const useStyles = makeStyles((theme) => ({
  clauseTitle: {
    fontSize: '1.2rem',
    minWidth: '120px'
  },
  queryClause: {
    padding: '5px'
  }
}));

const QueryFromPane = () => {
  const {state, patchState, setRootModel} = useContext(QueryContext);

  let reduxState = useReduxState();

  const onRootModelSelect = useCallback(
    (modelName: string) => {
      if ('' !== modelName) {
        let template = selectTemplate(reduxState, modelName);
        setRootModel(modelName, {
          model_name: modelName,
          attribute_name: template.identifier,
          display_label: `${modelName}.${template.identifier}`,
          slices: []
        });
      } else {
        setRootModel(null, null);
      }
    },
    [reduxState]
  );

  const classes = useStyles();

  useUriQueryParams(state, patchState);

  return (
    <QueryClause title='From'>
      <QueryModelSelector
        label='Root Model'
        modelValue={state.rootModel || ''}
        modelChoiceSet={
          state.graph && state.graph.allowedModels
            ? [...state.graph.allowedModels]
            : []
        }
        onSelectModel={(modelName) => onRootModelSelect(modelName)}
        canRemove={false}
        removeModel={() => {}}
      />
    </QueryClause>
  );
};

export default QueryFromPane;
