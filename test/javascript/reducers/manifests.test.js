import reducer from '../../../app/assets/javascripts/reducers/manifests_reducer'

describe('manifests reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual({})
  })

  it('should handle REMOVE_MANIFEST', () => {
    const initialState = {
      "8":{
        "id":8,
        "name":"manifest1",
        "description":"private manifest",
        "project":"ipi",
        "access":"private",
        "data":{
          "elements":[
            {
              "name":"var1",
              "description":"",
              "script":"[1,2,3,4]"
            },
            {
              "name":"var2",
              "description":"",
              "script":"'abc'"
            }
          ]
        },
        "created_at":"2017-09-18T23:58:11.048Z",
        "updated_at":"2017-09-18T23:58:11.048Z",
        "user":{
          "name":"Darrell Abrau"
        },
        "plots":[

        ],
        "is_editable":true
      },
      "9":{
        "id":9,
        "name":"manifest2",
        "description":"public manifest",
        "project":"ipi",
        "access":"public",
        "data":{
          "elements":[
            {
              "name":"var1",
              "description":"",
              "script":"'xyz'"
            },
            {
              "name":"var2",
              "description":"",
              "script":"['1', 'abc', '4']"
            }
          ]
        },
        "created_at":"2017-09-18T23:58:50.495Z",
        "updated_at":"2017-09-18T23:58:50.495Z",
        "user":{
          "name":"Darrell Abrau"
        },
        "plots":[

        ],
        "is_editable":true
      }
    }

    expect(
      reducer(initialState, {
        type: 'REMOVE_MANIFEST',
        id: 9
      })
    ).toEqual(
      {
        8:{
          "id":8,
          "name":"manifest1",
          "description":"private manifest",
          "project":"ipi",
          "access":"private",
          "data":{
            "elements":[
              {
                "name":"var1",
                "description":"",
                "script":"[1,2,3,4]"
              },
              {
                "name":"var2",
                "description":"",
                "script":"'abc'"
              }
            ]
          },
          "created_at":"2017-09-18T23:58:11.048Z",
          "updated_at":"2017-09-18T23:58:11.048Z",
          "user":{
            "name":"Darrell Abrau"
          },
          "plots":[

          ],
          "is_editable":true
        }
      }
    )
  })

  it('should handle ADD_MANIFEST', () => {
    const newManifest = {
      "id":10,
      "name":"new_manifest",
      "description":"new new",
      "project":"ipi",
      "access":"private",
      "data":{
        "elements":[
          {
            "name":"var",
            "description":"",
            "script":"'var'"
          }
        ]
      },
      "created_at":"2017-09-19T00:11:12.260Z",
      "updated_at":"2017-09-19T00:11:12.260Z",
      "user":{
        "name":"Darrell Abrau"
      },
      "plots":[

      ],
      "is_editable":true
    }

    expect(
      reducer({}, {
        type: 'ADD_MANIFEST',
        manifest: newManifest
      })
    ).toEqual({
      10: newManifest
    })
  })

  it('should handle UPDATE_MANIFEST', () => {
    const initialState = {
      10: {
        "id": 10,
        "name": "new_manifest",
        "description": "new new",
        "project": "ipi",
        "access": "private",
        "data": {
          "elements": [
            {
              "name": "var",
              "description": "",
              "script": "'var'"
            }
          ]
        },
        "created_at": "2017-09-19T00:11:12.260Z",
        "updated_at": "2017-09-19T00:11:12.260Z",
        "user": {
          "name": "Darrell Abrau"
        },
        "plots": [],
        "is_editable": true
      }
    }

    const updatedManifest = {
      "id":10,
      "name":"changed",
      "description":"changed",
      "project":"changed",
      "access":"public",
      "data":{
        "elements":[
          {
            "name":"var2",
            "description":"",
            "script":"'var2'"
          }
        ]
      },
      "created_at":"2017-09-19T00:11:12.260Z",
      "updated_at":"2017-09-19T00:11:12.260Z",
      "user":{
        "name":"Darrell Abrau"
      },
      "plots":[

      ],
      "is_editable":true
    }

    expect(
      reducer(initialState, {
        type: 'ADD_MANIFEST',
        manifest: updatedManifest
      })
    ).toEqual({
      10: updatedManifest
    })
  })

  it('should handle REMOVE_PLOT', () => {
    const initialState = {
      10: {
        "id": 10,
        "name": "new_manifest",
        "description": "new new",
        "project": "ipi",
        "access": "private",
        "data": {
          "elements": [
            {
              "name": "var",
              "description": "",
              "script": "'var'"
            }
          ]
        },
        "created_at": "2017-09-19T00:11:12.260Z",
        "updated_at": "2017-09-19T00:11:12.260Z",
        "user": {
          "name": "Darrell Abrau"
        },
        "plotIds": [1, 2, 3],
        "is_editable": true
      }
    }


    expect(
      reducer(initialState, {
        type: 'REMOVE_PLOT',
        manifestId: 10,
        id: 3
      })
    ).toEqual({
      10: {
        "id": 10,
        "name": "new_manifest",
        "description": "new new",
        "project": "ipi",
        "access": "private",
        "data": {
          "elements": [
            {
              "name": "var",
              "description": "",
              "script": "'var'"
            }
          ]
        },
        "created_at": "2017-09-19T00:11:12.260Z",
        "updated_at": "2017-09-19T00:11:12.260Z",
        "user": {
          "name": "Darrell Abrau"
        },
        "plotIds": [1, 2],
        "is_editable": true
      }
    })
  })
})