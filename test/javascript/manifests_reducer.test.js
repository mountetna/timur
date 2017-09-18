import reducer from '../../app/assets/javascripts/reducers/manifests_reducer'

describe('manifests reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({})
  })

  it('should handle REMOVE_MANIFEST', () => {
    const initialState = {
      a: {'x': 'y'},
      b: {'q': 'c'}
    }
    expect(
      reducer(initialState, {
        type: 'REMOVE_MANIFEST',
        id: 'b'
      })
    ).toEqual(
      {
        a: {'x': 'y'}
      }
    )
  })
})