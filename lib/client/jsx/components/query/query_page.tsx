import React from 'react';
import Grid from '@material-ui/core/Grid';

import {QueryProvider} from '../../contexts/query/query_context';
import QueryBuilder from './query_builder';

const QueryPage = ({}) => {
  return (
    <React.Fragment>
      <QueryProvider>
        <Grid container spacing={5}>
          <Grid item>
            <QueryBuilder />
          </Grid>
        </Grid>
      </QueryProvider>
    </React.Fragment>
  );
};

export default QueryPage;
