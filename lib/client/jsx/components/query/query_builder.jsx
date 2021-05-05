import React from 'react';
import {QueryProvider} from '../../contexts/query/query_context';
import QueryMap from './query_map';

export default function QueryBuilder({}) {
  return (
    <React.Fragment>
      <QueryProvider>
        <QueryMap />
      </QueryProvider>
    </React.Fragment>
  );
}
