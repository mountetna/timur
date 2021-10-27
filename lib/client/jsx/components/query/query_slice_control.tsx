import React, {useCallback} from 'react';
import Grid from '@material-ui/core/Grid';

import {
  QueryClause,
  QuerySlice,
  EmptyQueryClause
} from '../../contexts/query/query_types';
import {QueryGraph} from '../../utils/query_graph';
import QueryFilterClause from './query_filter_clause';
import RemoveIcon from './query_remove_icon';
import Selector from './query_selector';

const QuerySliceControl = ({
  slice,
  modelNames,
  graph,
  patchSlice,
  removeSlice
}: {
  slice: QuerySlice;
  modelNames: string[];
  graph: QueryGraph;
  patchSlice: (slice: QuerySlice) => void;
  removeSlice: () => void;
}) => {
  const handleModelSelect = useCallback(
    (modelName: string) => {
      patchSlice({
        modelName,
        clauses: [
          {
            ...EmptyQueryClause
          }
        ]
      });
    },
    [patchSlice]
  );

  const handlePatchClause = useCallback(
    (clause: QueryClause, index: number) => {
      let updatedClauses = [...slice.clauses];
      updatedClauses[index] = clause;
      patchSlice({
        ...slice,
        clauses: updatedClauses
      });
    },
    [patchSlice, slice]
  );

  return (
    <>
      <Grid item xs={3}>
        <Selector
          canEdit={true}
          name={slice.modelName}
          onSelect={handleModelSelect}
          choiceSet={modelNames}
          label='model'
        />
      </Grid>
      <Grid item container xs={8} direction='column'>
        <QueryFilterClause
          clause={slice.clauses[0]}
          clauseIndex={0}
          modelName={slice.modelName}
          graph={graph}
          isColumnFilter={true}
          patchClause={(updatedClause: QueryClause) =>
            handlePatchClause(updatedClause, 0)
          }
          removeClause={() => {}}
        />
      </Grid>
      <Grid item xs={1} container justify='flex-end'>
        <RemoveIcon canEdit={true} onClick={removeSlice} label='slice' />
      </Grid>
    </>
  );
};
export default QuerySliceControl;
