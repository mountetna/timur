import reducer from '../../../lib/client/jsx/reducers/location_reducer';

describe('location reducer', () => {
  it('should return the current location by default', () => {
    expect(reducer(undefined, {})).toEqual(
      {
        path: window.location.pathname,
        hash: null
      }
    );
  });

  it('should handle UPDATE_LOCATION for relative urls', () => {
    const link = '/new-location';
    expect(
      reducer(null,
        {
        type: 'UPDATE_LOCATION',
        link
      })
    ).toEqual({
      path: link,
      hash: null
    });
  });
});
