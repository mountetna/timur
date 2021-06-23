import React from 'react';
import Grid from '@material-ui/core/Grid';
import {makeStyles} from '@material-ui/core/styles';

import QueryFromPane from './query_from_pane';
import QuerySelectPane from './query_select_pane';
import QueryWherePane from './query_where_pane';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%'
  },
  item: {
    width: '100%'
  }
}));

const QueryControls = () => {
  const classes = useStyles();

  return (
    <Grid
      item
      container
      className={classes.container}
      justify='flex-start'
      alignItems='center'
      direction='column'
      xs={12}
    >
      <QueryFromPane />
      <QueryWherePane />
      <QuerySelectPane />
    </Grid>
  );
};

export default QueryControls;
