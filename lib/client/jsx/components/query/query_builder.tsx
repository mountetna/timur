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

  return (
    <Grid container spacing={1} direction='column'>
      <Grid item xs={12}>
        <QueryControls />
      </Grid>
      <Grid item className={classes.previewPane}>
        <QueryResults key={state.rootModel} />
      </Grid>
    </Grid>
  );
};

export default QueryBuilder;
