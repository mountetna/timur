// Framework libraries.
import * as React from 'react';
import * as ReactRedux from 'react-redux';

// Class imports.
import PlotlyComponent from '../plotly';

// Module imports.
import * as PlotActions from '../../../actions/plot_actions';

export class ScatterPlot extends React.Component{
  constructor(props){
    super(props);
  }

  onDataSelection(selected_data){
    if(selected_data == undefined) return;

    this.props.selectPoints(
      selected_data.points.map((point)=>{return point.id})
    );
  }

  render(){
    let {data, layout, config} = this.props;

    let plot_props = {
      data,
      layout,
      config,
      onSelected: this.onDataSelection.bind(this)
    };

    return <PlotlyComponent {...plot_props} />;
  }
}

const processData = (data, consignment)=>{
  try{
    return data.map((series)=>{
      let x = series.x || series.manifestSeriesX;
      let y = series.y || series.manifestSeriesY;

      // Add ids from y or x labels.
      let ids = [];
      if(consignment[y]){
        ids = consignment[y].labels;
      }
      else if(consignment[x]){
        ids = consignment[x].labels;
      }

      return {
        type: 'scatter',
        mode: series.mode || 'markers',
        name: series.name || '',
        x: consignment[x] ? consignment[x].values : [],
        y: consignment[y] ? consignment[y].values : [],
        ids,
      };
    });
  }
  catch(error){
    //console.log(error);
    return [];
  }
};

const processLayout = (plot)=>{
  try {
    return {
      width: plot.layout.width || 1600,
      height: plot.layout.height || 900,
      title: plot.name || '',
      xaxis: {
        title: plot.layout.xaxis.title || '',
        showline: true,
        showgrid: plot.layout.xaxis.showgrid || false,
        gridcolor: '#bdbdbd'
      },
      yaxis: {
        title: plot.layout.yaxis.title || '',
        showline: true,
        showgrid: plot.layout.yaxis.showgrid || false,
        gridcolor: '#bdbdbd'
      }
    };
  }
  catch(error){
    //console.log(error);
    return {};
  }
};

const processConfig = ()=>{
  return {
    showLink: false,
    displayModeBar: true,
    modeBarButtonsToRemove: ['sendDataToCloud', 'toggleSpikelines']
  };
}

const mapStateToProps = (state = {}, own_props)=>{
  return {
    data: processData(own_props.plot.data, own_props.consignment),
    layout: processLayout(own_props.plot),
    config: processConfig()
  };
};

const mapDispatchToProps = (dispatch, own_props)=>{
  return {
    selectPoints: (point_ids)=>{
      dispatch(PlotActions.selectPoints(point_ids));
    }
  };
};

export const ScatterPlotContainer = ReactRedux.connect(
  mapStateToProps,
  mapDispatchToProps
)(ScatterPlot);
