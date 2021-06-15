import React from 'react';
import Grid from '@material-ui/core/Grid';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {requestModels} from 'etna-js/actions/magma_actions';

import {QueryProvider} from '../../contexts/query/query_context';
import QueryBuilder from './query_builder';

const QueryPage = ({}) => {
  const invoke = useActionInvoker();
  invoke(requestModels());

  return (
    <React.Fragment>
      <QueryProvider>
        <Grid container spacing={5} direction='column' className='query-page'>
          <Grid item xs={12}>
            <QueryBuilder />
          </Grid>
        </Grid>
      </QueryProvider>
    </React.Fragment>
  );
};

export default QueryPage;
