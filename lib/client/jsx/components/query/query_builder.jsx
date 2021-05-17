import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

import QueryControls from './query_controls';
import QueryPreview from './query_preview';

const useStyles = makeStyles((theme) => ({
  previewPane: {
    overflowX: 'auto',
    maxWidth: '100%',
    maxHeight: '100%'
  }
}));

export default function QueryBuilder({}) {
  const classes = useStyles();

  return (
    <Grid container direction='column'>
      <Grid item>
        <QueryControls />
      </Grid>
      <Grid item className={classes.previewPane}>
        <QueryPreview />
      </Grid>
    </Grid>
  );
}
