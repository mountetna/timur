import nock from 'nock';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetch from 'isomorphic-fetch';

export const stubUrl = ({
  verb='get', path, response, request, status=200, headers={}, host='http://www.fake.com'
}) => {
  nock(host)[verb](path, request)
    .reply(
      status,
      response,
      {
        'Access-Control-Allow-Origin': '*',
        'Content-type': 'application/json',
        ...headers
      }
    );
}

export const cleanStubs = () => nock.cleanAll();


export const mockStore = configureMockStore([
  thunk
]);

export const setConfig = (config) => global.TIMUR_CONFIG = config;

export const mockDate = () => {
  const currentDate = new Date();
  global.Date = jest.fn(() => currentDate);
}

export const mockFetch = () => global.fetch = fetch;
