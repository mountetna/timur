import 'isomorphic-fetch'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import * as actions from '../../../app/assets/javascripts/actions/manifest_actions'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  global.PROJECT_NAME = 'ipi'
  global.Routes = {
    manifests_fetch_path: (projectName) => `http://www.fake.com/${projectName}/manifests`,
    manifests_destroy_path: (projectName, manifestId) => {console.log(`http://www.fake.com/${projectName}/manifests/destroy/${manifestId}`); return `http://www.fake.com/${projectName}/manifests/destroy/${manifestId}`}
  }
  global.fetch = fetch
  const currentDate = new Date()
  global.Date = jest.fn(() => currentDate)

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, LOAD_MANIFESTS, and ADD_PLOT when fetching user manifests has been done', () => {
    nock('http://www.fake.com')
      .post('/ipi/manifests')
      .reply(
        200,
        {
          "manifests":[
            {
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
            {
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
            },
            {
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
            },
            {
              "id":11,
              "name":"manifest_for_plot",
              "description":"for plot",
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
                    "script":"[1,2,3,4]"
                  }
                ]
              },
              "created_at":"2017-09-19T21:05:13.224Z",
              "updated_at":"2017-09-19T21:05:13.224Z",
              "user":{
                "name":"Darrell Abrau"
              },
              "plots":[
                {
                  "manifest_id":11,
                  "id":3,
                  "name":"test",
                  "plot_type":"scatter",
                  "configuration":{
                    "data":[
                      {
                        "type":"scatter",
                        "mode":"markers",
                        "name":"series1",
                        "id":0.9668614107081013,
                        "manifestSeriesX":"var1",
                        "manifestSeriesY":"var2",
                        "uid":"4f8972"
                      }
                    ],
                    "layout":{
                      "width":1600,
                      "height":900,
                      "title":"test",
                      "xaxis":{
                        "title":"test x axis",
                        "showline":true,
                        "showgrid":true,
                        "gridcolor":"#bdbdbd"
                      },
                      "yaxis":{
                        "title":"test y axis",
                        "showline":true,
                        "showgrid":true,
                        "gridcolor":"#bdbdbd"
                      }
                    },
                    "config":{
                      "showLink":false,
                      "displayModeBar":true,
                      "modeBarButtonsToRemove":[
                        "sendDataToCloud",
                        "lasso2d",
                        "toggleSpikelines"
                      ]
                    },
                    "plotType":"scatter"
                  },
                  "created_at":"2017-09-19T21:06:30.430Z",
                  "updated_at":"2017-09-19T21:06:30.430Z"
                }
              ],
              "is_editable":true
            }
          ]
        },
        {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json'
        }
      )

    const storedManifests = {
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
        "is_editable":true,
        "plotIds":[

        ]
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
        "is_editable":true,
        "plotIds":[

        ]
      },
      "10":{
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
        "is_editable":true,
        "plotIds":[

        ]
      },
      "11":{
        "id":11,
        "name":"manifest_for_plot",
        "description":"for plot",
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
              "script":"[1,2,3,4]"
            }
          ]
        },
        "created_at":"2017-09-19T21:05:13.224Z",
        "updated_at":"2017-09-19T21:05:13.224Z",
        "user":{
          "name":"Darrell Abrau"
        },
        "is_editable":true,
        "plotIds":[
          3
        ]
      }
    }

    const expectedActions = [
      {
        "exchange":{
          "exchange_name":"request-manifest",
          "exchange_path":"http://www.fake.com/ipi/manifests",
          "start_time": currentDate
        },
        "exchange_name":"request-manifest",
        "type":"ADD_EXCHANGE"
      },
      {
        "exchange_name":"request-manifest",
        "type":"REMOVE_EXCHANGE"
      },
      {
        type: 'LOAD_MANIFESTS',
        manifestsById: storedManifests
      },
      {
        "plot":{
          "configuration":{
            "config":{
              "displayModeBar":true,
              "modeBarButtonsToRemove":[
                "sendDataToCloud",
                "lasso2d",
                "toggleSpikelines"
              ],
              "showLink":false
            },
            "data":[
              {
                "id":0.9668614107081013,
                "manifestSeriesX":"var1",
                "manifestSeriesY":"var2",
                "mode":"markers",
                "name":"series1",
                "type":"scatter",
                "uid":"4f8972"
              }
            ],
            "layout":{
              "height":900,
              "title":"test",
              "width":1600,
              "xaxis":{
                "gridcolor":"#bdbdbd",
                "showgrid":true,
                "showline":true,
                "title":"test x axis"
              },
              "yaxis":{
                "gridcolor":"#bdbdbd",
                "showgrid":true,
                "showline":true,
                "title":"test y axis"
              }
            },
            "plotType":"scatter"
          },
          "created_at":"2017-09-19T21:06:30.430Z",
          "id":3,
          "is_editable":true,
          "manifest_id":11,
          "name":"test",
          "plot_type":"scatter",
          "updated_at":"2017-09-19T21:06:30.430Z"
        },
        "type":"ADD_PLOT"
      }
    ]

    const store = mockStore({ manifests: storedManifests })

    return store.dispatch(actions.requestManifests()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('creates ADD_EXCHANGE, REMOVE_EXCHANGE, SELECT_MANIFEST, and REMOVE_MANIFEST when deleting user manifests has been done', () => {
    nock('http://www.fake.com')
      .post('/ipi/manifests/destroy/1')
      .reply(
        200,
        {"success":true},
        {
          'Access-Control-Allow-Origin': '*',
          'Content-type': 'application/json'
        }
      )

    const expectedActions = [
      {
        "exchange":{
          "exchange_name":"delete-manifest",
          "exchange_path":"http://www.fake.com/ipi/manifests/destroy/1",
          "start_time": currentDate
        },
        "exchange_name":"delete-manifest",
        "type":"ADD_EXCHANGE"
      },
      {
        "exchange_name":"delete-manifest",
        "type":"REMOVE_EXCHANGE"
      },
      {
        type: 'SELECT_MANIFEST',
        id: null
      },
      {
        type: 'REMOVE_MANIFEST',
        id: 1
      }
    ]

    const store = mockStore({})

    return store.dispatch(actions.deleteManifest(1)).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
})

describe('actions', () => {
  it('transforms the serialized manifest form to the manifest form for the query payload', () => {
    const serializedManifest = {
      "id":11,
      "name":"manifest_for_plot",
      "description":"for plot",
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
            "script":"[1,2,3,4]"
          }
        ]
      },
      "created_at":"2017-09-19T21:05:13.224Z",
      "updated_at":"2017-09-19T21:05:13.224Z",
      "user":{
        "name":"Darrell Abrau"
      },
      "is_editable":true,
      "plotIds":[
        3
      ]
    }

    const queryPayload = {
      "manifest":[
        [
          "var1",
          "[1,2,3,4]"
        ],
        [
          "var2",
          "[1,2,3,4]"
        ]
      ],
      "name":"manifest_for_plot"
    }

    expect(actions.manifestToReqPayload(serializedManifest)).toEqual(queryPayload)
  })
})