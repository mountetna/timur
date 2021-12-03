import React, {useCallback, useMemo} from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';

import {QueryClause, QueryFilter} from '../../contexts/query/query_types';
import {emptyQueryClauseStamp} from '../../selectors/query_selector';
import {QueryGraph} from '../../utils/query_graph';
import QueryFilterClause from './query_filter_clause';
import RemoveIcon from './query_remove_icon';
import CopyIcon from './query_copy_icon';
import Selector from './query_selector';

const useStyles = makeStyles((theme) => ({
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
  copyFilter: () => void;
}) => {
  const classes = useStyles();

  const handleModelSelect = useCallback(
    (modelName: string) => {
      patchFilter({
        modelName,
        anyMap: {},
        clauses: [emptyQueryClauseStamp(graph, modelName)]
      });
    },
    [patchFilter, graph]
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
      clauses: [...filter.clauses].concat([
        emptyQueryClauseStamp(graph, filter.modelName)
      ])
    });
  }, [patchFilter, filter, graph]);

  const handleClauseAnySelect = useCallback(
    (val: string, clause: QueryClause, index: number) => {
      handlePatchClause(
        {
          ...clause,
          any: val === 'Any'
        },
        index
      );
    },
    [handlePatchClause]
  );

  const modelChildren = useMemo(() => {
    if (!filter.modelName || filter.modelName === '') return {};

    return graph.childrenMap(filter.modelName);
  }, [filter.modelName, graph]);

  return (
    <>
      <Grid item xs={2}>
        <Selector
          canEdit={true}
          name={filter.modelName}
          onSelect={handleModelSelect}
          choiceSet={modelNames}
          label='model'
        />
      </Grid>
      <Grid item container xs={9} direction='column'>
        <Grid container direction='column' className={classes.grid}>
          {filter.clauses.map((clause: QueryClause, index: number) => {
            return (
              <Paper className={classes.paper} key={index}>
                <Grid item container alignItems='center'>
                  <Grid item xs={1}>
                    {modelChildren[clause.modelName] ? (
                      <Selector
                        canEdit={true}
                        name={clause.any ? 'Any' : 'Every'}
                        onSelect={(val: string) =>
                          handleClauseAnySelect(val, clause, index)
                        }
                        choiceSet={['Any', 'Every']}
                        label='model'
                      />
                    ) : null}
                  </Grid>
                  <Grid item xs={11}>
                    <QueryFilterClause
                      clause={clause}
                      clauseIndex={index}
                      graph={graph}
                      modelNames={Object.keys(modelChildren)}
                      isColumnFilter={false}
                      patchClause={(updatedClause: QueryClause) =>
                        handlePatchClause(updatedClause, index)
                      }
                      removeClause={() => handleRemoveClause(index)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            );
          })}
        </Grid>
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
      </Grid>
      <Grid item xs={1} container justify='flex-end'>
        <CopyIcon canEdit={true} onClick={copyFilter} label='filter' />
        <RemoveIcon canEdit={true} onClick={removeFilter} label='filter' />
      </Grid>
    </>
  );
};
export default QueryFilterControl;
