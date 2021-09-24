import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';

import {makeStyles} from '@material-ui/core/styles';
import QueryControls from './query_controls';
import QueryResults from './query_results';
import {QueryGraphContext} from '../../contexts/query/query_graph_context';

import {QueryColumnProvider} from '../../contexts/query/query_column_context';
import {QueryWhereProvider} from '../../contexts/query/query_where_context';

const useStyles = makeStyles((theme) => ({
  previewPane: {
    overflowX: 'auto',
    maxWidth: '100%',
    maxHeight: '100%'
  }
}));

const QueryBuilder = ({}) => {
  const {
    state: {graph}
  } = useContext(QueryGraphContext);
  const classes = useStyles();

  if (!graph || !graph.initialized) return null;

  return (
    <QueryColumnProvider>
      <QueryWhereProvider>
        <Grid container direction='column'>
          <QueryControls />
          <Grid item className={classes.previewPane}>
            <QueryResults />
          </Grid>
        </Grid>
      </QueryWhereProvider>
    </QueryColumnProvider>
  );
};

export default QueryBuilder;
