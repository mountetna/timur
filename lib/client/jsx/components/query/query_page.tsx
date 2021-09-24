import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {requestModels} from 'etna-js/actions/magma_actions';

import {QueryGraphProvider} from '../../contexts/query/query_graph_context';
import QueryBuilder from './query_builder';

const QueryPage = ({}) => {
  const invoke = useActionInvoker();

  useEffect(() => {
    invoke(requestModels());
  }, []);

  return (
    <React.Fragment>
      <QueryGraphProvider>
        <Grid container direction='column' className='query-page'>
          <Grid item xs={12}>
            <QueryBuilder />
          </Grid>
        </Grid>
      </QueryGraphProvider>
    </React.Fragment>
  );
};

export default QueryPage;
