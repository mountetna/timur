import React from 'react';
import Grid from '@material-ui/core/Grid';

import {QueryProvider} from '../../contexts/query/query_context';
import QueryMap from './query_map';
import QueryBuilder from './query_builder';

export default function QueryPage({}) {
  return (
    <React.Fragment>
      <QueryProvider>
        <Grid container spacing={5}>
          <Grid item>
            <QueryMap />
          </Grid>
          <Grid item xs={7}>
            <QueryBuilder />
          </Grid>
        </Grid>
      </QueryProvider>
    </React.Fragment>
  );
}
