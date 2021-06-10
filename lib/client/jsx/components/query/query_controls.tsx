import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

import QuerySelectPane from './query_select_pane';
import QueryWherePane from './query_where_pane';
import QuerySlicePane from './query_slice_pane';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  container: {
    width: '100%'
  }
}));

const QueryControls = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      xs={12}
      className={classes.container}
      justify='center'
      alignItems='center'
      direction='column'
    >
      <Grid item container spacing={2}>
        <Grid item xs={3}>
          <QuerySelectPane />
        </Grid>
        <Grid item xs={5}>
          <QueryWherePane />
        </Grid>
        <Grid item xs={4}>
          <QuerySlicePane />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default QueryControls;
