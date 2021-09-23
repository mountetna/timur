import React, {useEffect} from 'react';
import Grid from '@material-ui/core/Grid';

import {useActionInvoker} from 'etna-js/hooks/useActionInvoker';
import {requestModels} from 'etna-js/actions/magma_actions';

import {QueryGraphProvider} from '../../contexts/query/query_graph_context';
import {QueryColumnProvider} from '../../contexts/query/query_column_context';
import {QueryWhereProvider} from '../../contexts/query/query_where_context';
import QueryBuilder from './query_builder';

const QueryPage = ({}) => {
  const invoke = useActionInvoker();

  useEffect(() => {
    invoke(requestModels());
  }, []);

  return (
    <React.Fragment>
      <QueryGraphProvider>
        <QueryColumnProvider>
          <QueryWhereProvider>
            <Grid container direction='column' className='query-page'>
              <Grid item xs={12}>
                <QueryBuilder />
              </Grid>
            </Grid>
          </QueryWhereProvider>
        </QueryColumnProvider>
      </QueryGraphProvider>
    </React.Fragment>
  );
};

export default QueryPage;
