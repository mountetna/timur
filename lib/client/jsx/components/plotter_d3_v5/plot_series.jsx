import * as React from 'react';

class PlotSeries extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      list_open: false
    };
  }

  render(){
    return(
      <div>
        hello from plot series
      </div>
    );
  }
}

export default PlotSeries;
