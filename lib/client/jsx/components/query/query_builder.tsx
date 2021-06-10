import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

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

  return (
    <Grid container direction='column'>
      <Grid item>
        <QueryControls />
      </Grid>
      <Grid item className={classes.previewPane}>
        <QueryResults />
      </Grid>
    </Grid>
  );
};

export default QueryBuilder;
