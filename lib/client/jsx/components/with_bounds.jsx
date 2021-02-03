import React, {Component} from 'react'

class WithBounds extends Component{
  constructor(props){
    super(props);

    this.state = {
      bounds: null
    };

    this.getBounds = this.getBounds.bind(this);
  }

  componentDidMount(){
    this.getBounds();
  }

  getBounds(){
    let bounds = this.chartContainer.getBoundingClientRect();
    this.setState({ bounds });
  }

  render(){
    let {bounds} = this.state;
    let should_render = bounds !== null;

    return(
      <div className='position-wrapper' ref={ el => this.chartContainer = el } >
        {should_render && this.props.render(bounds)}
      </div>
    );
  }
}

export default WithBounds;
