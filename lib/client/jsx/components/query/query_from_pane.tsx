import React, {useCallback, useContext} from 'react';

import Grid from '@material-ui/core/Grid';

import {QueryGraphContext} from '../../contexts/query/query_graph_context';
import {QueryColumnContext} from '../../contexts/query/query_column_context';
import {QueryResultsContext} from '../../contexts/query/query_results_context';
import {EmptyQueryResponse} from '../../contexts/query/query_types';
import QueryModelSelector from './query_model_selector';
import QueryClause from './query_clause';
import QueryControlButtons from './query_control_buttons';

const QueryFromPane = () => {
  const {
    state: {graph, rootModel},
    setRootModel
  } = useContext(QueryGraphContext);
  const {setRootIdentifierColumn} = useContext(QueryColumnContext);
  const {setDataAndNumRecords} = useContext(QueryResultsContext);

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
      setDataAndNumRecords(EmptyQueryResponse, 0);
    },
    [graph, setRootModel, setRootIdentifierColumn, setDataAndNumRecords]
  );

  return (
    <QueryClause title='From'>
      <Grid item container>
        <Grid item xs={8}>
          <QueryModelSelector
            label='Root Model'
            modelValue={rootModel || ''}
            modelChoiceSet={[...graph.allowedModels]}
            onSelectModel={(modelName) => onRootModelSelect(modelName)}
          />
        </Grid>
        <Grid item container alignItems='center' justify='flex-end' xs={4}>
          {rootModel ? <QueryControlButtons /> : null}
        </Grid>
      </Grid>
    </QueryClause>
  );
};

export default QueryFromPane;
