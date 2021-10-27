import React, {useCallback} from 'react';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';

import {
  QueryClause,
  QuerySlice,
  EmptyQueryClause
} from '../../contexts/query/query_types';
import {QueryGraph} from '../../utils/query_graph';
import QueryFilterClause from './query_filter_clause';
import RemoveIcon from './query_remove_icon';

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '80%'
  }
}));

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
  const classes = useStyles();

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

  let uniqId = (idType: string): string =>
    `${idType}-Select-${Math.random().toString()}`;

  return (
    <>
      <Grid item xs={3}>
        <FormControl className={classes.fullWidth}>
          <Select
            labelId={uniqId('model')}
            value={slice.modelName}
            onChange={(e) => handleModelSelect(e.target.value as string)}
            displayEmpty
          >
            {modelNames.map((name, index: number) => (
              <MenuItem key={index} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
