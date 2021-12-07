import React from 'react';
import nock from 'nock';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetch from 'isomorphic-fetch';
import {Provider} from 'react-redux';
import {StylesOptions, StylesProvider} from '@material-ui/styles/';

import {
  QueryColumnProvider,
  QueryColumnState
} from '../../lib/client/jsx/contexts/query/query_column_context';
import {
  QueryWhereProvider,
  QueryWhereState
} from '../../lib/client/jsx/contexts/query/query_where_context';
import {
  QueryGraphProvider,
  QueryGraphState
} from '../../lib/client/jsx/contexts/query/query_graph_context';
import {
  QueryResultsProvider,
  QueryResultsState
} from '../../lib/client/jsx/contexts/query/query_results_context';

export const stubUrl = ({
  verb = 'get',
  path,
  response,
  request,
  status = 200,
  headers = {},
  host = 'http://localhost',
  times = 1
}: {
  verb: string;
  path: string;
  request: any;
  response: any;
  status: number;
  headers?: any;
  host: string;
  times?: number;
}) => {
  nock(host)
    [verb](path, request)
    .times(times)
    .reply(status, response, {
      'Access-Control-Allow-Origin': '*',
      'Content-type': 'application/json',
      ...headers
    });
};

export const cleanStubs = () => nock.cleanAll();

export const mockStore = configureMockStore([thunk]);

export const mockDate = () => {
  const currentDate = new Date();

  global.Date = jest.fn(() => currentDate) as any;
};

export const mockFetch = () => (global.fetch = fetch);

export const generateClassName: StylesOptions['generateClassName'] = (
  rule,
  sheet
): string => `${sheet!.options.classNamePrefix}-${rule.key}`;

export const querySpecWrapper =
  ({
    mockColumnState,
    mockWhereState,
    mockGraphState,
    mockResultsState,
    store
  }: {
    mockColumnState: QueryColumnState;
    mockWhereState: QueryWhereState;
    mockGraphState: QueryGraphState;
    mockResultsState: QueryResultsState;
    store: typeof mockStore;
  }) =>
  ({children}: {children?: any}) =>
    (
      <Provider store={store}>
        <StylesProvider generateClassName={generateClassName}>
          <QueryGraphProvider state={mockGraphState}>
            <QueryColumnProvider state={mockColumnState}>
              <QueryWhereProvider state={mockWhereState}>
                <QueryResultsProvider state={mockResultsState}>
                  {children}
                </QueryResultsProvider>
              </QueryWhereProvider>
            </QueryColumnProvider>
          </QueryGraphProvider>
        </StylesProvider>
      </Provider>
    );
