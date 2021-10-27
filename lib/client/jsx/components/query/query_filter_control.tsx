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

import {
  QueryClause,
  QueryFilter,
  QuerySlice,
  EmptyQueryClause
} from '../../contexts/query/query_types';
import {QueryGraph} from '../../utils/query_graph';
import QueryFilterClause from './query_filter_clause';

const useStyles = makeStyles((theme) => ({
  textInput: {},
  fullWidth: {
    width: '80%'
  },
  paper: {
    padding: '0 0.5rem',
    marginBottom: '0.5rem'
  },
  paddingLeft: {
    paddingLeft: 'calc(0.5rem - 4px)'
  },
  paddingBottom: {
    paddingBottom: '0.5rem'
  }
}));

const QueryFilterControl = ({
  filter,
  modelNames,
  isColumnFilter,
  graph,
  patchFilter,
  removeFilter
}: {
  filter: QueryFilter | QuerySlice;
  modelNames: string[];
  isColumnFilter: boolean;
  graph: QueryGraph;
  patchFilter: (filter: QueryFilter | QuerySlice) => void;
  removeFilter: () => void;
}) => {
  const classes = useStyles();

  const handleModelSelect = useCallback(
    (modelName: string) => {
      patchFilter({
        modelName,
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
        {isColumnFilter ? (
          <QueryFilterClause
            clause={filter.clauses[0]}
            clauseIndex={0}
            modelName={filter.modelName}
            graph={graph}
            isColumnFilter={isColumnFilter}
            patchClause={(updatedClause: QueryClause) =>
              handlePatchClause(updatedClause, 0)
            }
            removeClause={() => {}}
          />
        ) : (
          <>
            <Grid className={classes.paddingBottom}>
              <Tooltip title='Add clause' aria-label='Add clause'>
                <Button className={classes.paddingLeft} startIcon={<AddIcon />}>
                  Clause
                </Button>
              </Tooltip>
            </Grid>
            {filter.clauses.map((clause: QueryClause, index: number) => {
              return (
                <Paper className={classes.paper} key={index}>
                  <Grid container spacing={1} alignItems='center'>
                    <QueryFilterClause
                      key={index}
                      clause={clause}
                      clauseIndex={index}
                      modelName={filter.modelName}
                      graph={graph}
                      isColumnFilter={isColumnFilter}
                      patchClause={(updatedClause: QueryClause) =>
                        handlePatchClause(updatedClause, index)
                      }
                      removeClause={() => handleRemoveClause(index)}
                    />
                  </Grid>
                </Paper>
              );
            })}
          </>
        )}
      </Grid>
      <Grid item xs={1} container justify='flex-end'>
        <Tooltip title='Remove filter' aria-label='remove filter'>
          <IconButton aria-label='remove filter' onClick={removeFilter}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </>
  );
};
export default QueryFilterControl;
