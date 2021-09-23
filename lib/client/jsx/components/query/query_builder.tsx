import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';

import {makeStyles} from '@material-ui/core/styles';
import QueryControls from './query_controls';
import QueryResults from './query_results';
import {QueryGraphContext} from '../../contexts/query/query_graph_context';
import useQueryGraph from '../../contexts/query/use_query_graph';

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
    <Grid container direction='column'>
      <QueryControls />
      <Grid item className={classes.previewPane}>
        <QueryResults />
      </Grid>
    </Grid>
  );
};

export default QueryBuilder;
