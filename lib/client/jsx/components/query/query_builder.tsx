import React, {useContext} from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

import {QueryContext} from '../../contexts/query/query_context';
import QueryControls from './query_controls';
import QueryResults from './query_results';

const useStyles = makeStyles((theme) => ({
  previewPane: {
    overflowX: 'auto',
    maxWidth: '100%',
    maxHeight: '100%'
  }
}));

const QueryBuilder = ({}) => {
  const classes = useStyles();
  const {state} = useContext(QueryContext);

  if (!state.graph || !state.graph.initialized) return null;

  return (
    <Grid container direction='column'>
      <QueryControls />
      <Grid item className={classes.previewPane}>
        <QueryResults key={state.rootModel} />
      </Grid>
    </Grid>
  );
};

export default QueryBuilder;
