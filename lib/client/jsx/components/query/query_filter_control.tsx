import React, {useCallback} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';

import {
  QueryClause,
  QueryFilter,
  EmptyQueryClause
} from '../../contexts/query/query_types';
import {QueryGraph} from '../../utils/query_graph';
import QueryFilterClause from './query_filter_clause';
import RemoveIcon from './query_remove_icon';
import CopyIcon from './query_copy_icon';

const useStyles = makeStyles((theme) => ({
  textInput: {},
  fullWidth: {
    width: '80%'
  },
  paper: {
    padding: '0.5rem 0.5rem 0 0.5rem',
    marginBottom: '0.5rem',
    height: '48px'
  },
  paddingLeft: {
    paddingLeft: 'calc(0.5rem - 4px)'
  },
  grid: {
    paddingTop: '0.5rem'
  }
}));

const QueryFilterControl = ({
  filter,
  modelNames,
  graph,
  patchFilter,
  removeFilter,
  copyFilter
}: {
  filter: QueryFilter;
  modelNames: string[];
  graph: QueryGraph;
  patchFilter: (filter: QueryFilter) => void;
  removeFilter: () => void;
  copyFilter: (filter: QueryFilter) => void;
}) => {
  const classes = useStyles();

  const handleModelSelect = useCallback(
    (modelName: string) => {
      patchFilter({
        modelName,
        anyMap: {},
        clauses: [
          {
            ...EmptyQueryClause
          }
        ]
      });
    },
    [patchFilter]
  );

  const handlePatchClause = useCallback(
    (clause: QueryClause, index: number) => {
      let updatedClauses = [...filter.clauses];
      updatedClauses[index] = clause;
      patchFilter({
        ...filter,
        clauses: updatedClauses
      });
    },
    [patchFilter, filter]
  );

  const handleRemoveClause = useCallback(
    (index: number) => {
      let updatedClauses = [...filter.clauses];
      updatedClauses.splice(index, 1);
      patchFilter({
        ...filter,
        clauses: updatedClauses
      });
    },
    [patchFilter, filter]
  );

  const handleAddClause = useCallback(() => {
    patchFilter({
      ...filter,
      clauses: [...filter.clauses].concat([{...EmptyQueryClause}])
    });
  }, [patchFilter, filter]);

  let uniqId = (idType: string): string =>
    `${idType}-Select-${Math.random().toString()}`;

  return (
    <>
      <Grid item xs={3}>
        <FormControl className={classes.fullWidth}>
          <Select
            labelId={uniqId('model')}
            value={filter.modelName}
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
        <Grid>
          <Tooltip title='Add and clause' aria-label='Add and clause'>
            <Button
              className={classes.paddingLeft}
              startIcon={<AddIcon />}
              onClick={handleAddClause}
            >
              And Clause
            </Button>
          </Tooltip>
        </Grid>
        <Grid direction='column' className={classes.grid}>
          {filter.clauses.map((clause: QueryClause, index: number) => {
            return (
              <Paper className={classes.paper} key={index}>
                <QueryFilterClause
                  key={index}
                  clause={clause}
                  clauseIndex={index}
                  modelName={filter.modelName}
                  graph={graph}
                  isColumnFilter={false}
                  patchClause={(updatedClause: QueryClause) =>
                    handlePatchClause(updatedClause, index)
                  }
                  removeClause={() => handleRemoveClause(index)}
                />
              </Paper>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={1} container justify='flex-end'>
        <CopyIcon
          canEdit={true}
          onClick={() => copyFilter(filter)}
          label='filter'
        />
        <RemoveIcon canEdit={true} onClick={removeFilter} label='filter' />
      </Grid>
    </>
  );
};
export default QueryFilterControl;
