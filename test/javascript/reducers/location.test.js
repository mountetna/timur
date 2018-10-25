import reducer from '../../../lib/client/jsx/reducers/location_reducer';

describe('location reducer', () => {
  it('should return the current location by default', () => {
    expect(reducer(undefined, {})).toEqual(window.location.pathname);
  });

  it('should handle UPDATE_LOCATION', () => {
    const link = '/new-location';
    expect(
      reducer(null,
        {
        type: 'UPDATE_LOCATION',
        link
      })
    ).toEqual(link);
  });
});
