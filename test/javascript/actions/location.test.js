import * as actions from '../../../lib/client/jsx/actions/location_actions';
import { mockStore, mockDate, mockFetch, setConfig, stubUrl, cleanStubs } from '../helpers';

const PROJECT_NAME = 'labors';

describe('setLocation', () => {
  it('adds a new state to the history and updates the store', () => {
    const store = mockStore({ });
    const link = 'http://www.fake.com/new_location';

    store.dispatch(actions.setLocation(link));

    // we have a new location
    expect(location.href).toEqual(link);
    expect(store.getActions()).toEqual([{link, type: 'UPDATE_LOCATION'}]);

    // the history is the same length
    expect(history.length).toEqual(1);
  });
});

describe('pushLocation', () => {
  it('adds a new state to the history and updates the store', () => {
    const store = mockStore({ });
    const link = 'http://www.fake.com/new_location';

    store.dispatch(actions.pushLocation(link));

    // we have a new location
    expect(location.href).toEqual(link);
    expect(store.getActions()).toEqual([{link, type: 'UPDATE_LOCATION'}]);

    // the history is longer
    expect(history.length).toEqual(2);
  });
});

