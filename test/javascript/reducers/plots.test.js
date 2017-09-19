import reducer from '../../../app/assets/javascripts/reducers/plots_reducer'

describe('plots reducer', () => {
  const initialState = {
    plotsMap: {},
    selected: null,
    isEditing: false
  }

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should handle SELECT_PLOT', () => {
    expect(
      reducer(initialState, {
        type: 'SELECT_PLOT',
        id: 3
      })
    ).toEqual({
      plotsMap: {},
      selected: 3,
      isEditing: false
    })
  })

  it('should handle TOGGLE_PLOT_EDITING without isEditing boolean', () => {
    expect(
      reducer(initialState, {
        type: 'TOGGLE_PLOT_EDITING'
      })
    ).toEqual({
      plotsMap: {},
      selected: null,
      isEditing: true
    })
  })

  it('should handle TOGGLE_PLOT_EDITING with isEditing boolean', () => {
    expect(
      reducer({isEditing: false}, {
        type: 'TOGGLE_PLOT_EDITING',
        isEditing: true
      })
    ).toEqual({
      plotsMap: {},
      selected: null,
      isEditing: true
    })
  })

  const testPlot = {
    "id":3,
    "manifest_id":11,
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
    "updated_at":"2017-09-19T21:06:30.430Z",
    "is_editable":true
  }

  it('should handle ADD_PLOT ', () => {
    expect(
      reducer(undefined, {
        type: 'ADD_PLOT',
        plot: testPlot
      })
    ).toEqual({
      plotsMap: { 3: testPlot },
      selected: null,
      isEditing: false
    })
  })

  it('should handle REMOVE_PLOT ', () => {
    expect(
      reducer({ plotsMap: { 3: testPlot }}, {
        type: 'REMOVE_PLOT',
        id: 3
      })
    ).toEqual({
      plotsMap: {},
      selected: null,
      isEditing: false
    })
  })

  it('should handle UPDATE_PLOT ', () => {
    const updatedPlot = {
      ...testPlot,
      name: 'changed',
      random: 'property'
    }

    expect(
      reducer({ plotsMap: { 3: testPlot }}, {
        type: 'UPDATE_PLOT',
        plot: updatedPlot
      })
    ).toEqual({
      plotsMap: { 3: updatedPlot },
      selected: null,
      isEditing: false
    })
  })
})