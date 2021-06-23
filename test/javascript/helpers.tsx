import React from 'react';
import nock from 'nock';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetch from 'isomorphic-fetch';
import {Provider} from 'react-redux';
import {StylesOptions, StylesProvider} from '@material-ui/styles/';

import {
  QueryProvider,
  QueryState
} from '../../lib/client/jsx/contexts/query/query_context';

export const stubUrl = ({
  verb = 'get',
  path,
  response,
  request,
  status = 200,
  headers = {},
  host = 'http://localhost'
}: {
  verb: string;
  path: string;
  request: any;
  response: any;
  status: number;
  headers: any;
  host: string;
}) => {
  nock(host)
    [verb](path, request)
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

export const querySpecWrapper = (
  mockState: QueryState,
  store: typeof mockStore
) => ({children}: {children?: any}) => (
  <Provider store={store}>
    <StylesProvider generateClassName={generateClassName}>
      <QueryProvider state={mockState}>{children}</QueryProvider>
    </StylesProvider>
  </Provider>
);
