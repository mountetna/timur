import reducer from '../../../lib/client/jsx/reducers/manifests_reducer';
import manifestStore, { manifest } from '../fixtures/manifests_store'

describe('manifests reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({});
  });

  it('should handle REMOVE_MANIFEST', () => {
    const initialState = { ...manifestStore };

    const deletedManifestId = 9;

    const expectedStore = { ...initialState };
    delete expectedStore[deletedManifestId];

    expect(
      reducer(initialState, {
        type: 'REMOVE_MANIFEST',
        id: deletedManifestId
      })
    ).toEqual(expectedStore);
  });

  it('should handle ADD_MANIFEST', () => {
    expect(
      reducer({}, {
        type: 'ADD_MANIFEST',
        manifest: manifest
      })
    ).toEqual({
      [manifest.id]: manifest
    });
  });

  it('should handle UPDATE_MANIFEST', () => {
    const initialState = { ...manifestStore };
    const firstManifestId = Object.keys(initialState)[0];
    const updatedManifest = {
     id:firstManifestId,
     name:'changed',
     description:'changed',
     project:'changed',
     access:'public',
     data:{
       elements:[
          {
            name:"var2",
            description:"",
            script:"'var2'"
          }
        ]
      },
     created_at:'2017-09-19T00:11:12.260Z',
     updated_at:'2017-09-19T00:11:12.260Z',
     user:{
       name:'Darrell Abrau'
      },
     plots:[

      ],
     is_editable:true
    };
    const expectedStore = { ...initialState, [firstManifestId]: updatedManifest };

    expect(
      reducer(initialState, {
        type: 'UPDATE_USER_MANIFEST',
        manifest: updatedManifest
      })
    ).toEqual(expectedStore);
  });

  it('should handle REMOVE_PLOT', () => {
    const initialState = { ...manifestStore };
    const manifestId = 10;
    const plotId = 3;

    const expected = {
      ...initialState,
      [manifestId]: {
        ...initialState[manifestId],
      }
    };

    expect(
      reducer(initialState, {
        type: 'REMOVE_PLOT',
        manifestId,
        id: plotId
      })
    ).toEqual(expected);
  });
});
