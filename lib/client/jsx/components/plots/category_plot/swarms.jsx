import React, {Component} from 'react';
import * as d3 from 'd3';
import {interpolateLab} from 'd3-interpolate';
import { categoryGroups } from './category_plot';
import { createWorker, terminateWorker } from '../../../web-workers'

const Dots = (label, values) => ({ label, values });

const Dot = ({x,y, text_position, color}) =>
  <g className='dot'>
    <circle
      r='2'
      cx={ x }
      cy={ y }
      fill={ color }
      stroke='none'
    />
    <text textAnchor='end' x={ text_position - 4 } y={y} ></text>
  </g>;

class Swarms extends Component{
  constructor(props) {
    super(props)
    this.state = { groups: {} }
  }

  killWorker() {
    if (this.worker) terminateWorker(this.worker);
  }

  addGroup({data}) {
    // append the swarm points
    let { groups } = this.state;

    this.setState(
      { groups: {...groups, [data.label]: data } },
      // kill worker when all points are added
      () => {
        if (Object.values(this.state.groups).every(({xvalues}) => xvalues))
          this.killWorker();
      }
    )
  }

  calculateSwarmPoints() {
    let { series, xScale, yScale, width } = this.props;
    let { variables: { category, value } } = series;

    // kill potentially busy worker
    this.killWorker();

    // set worker
    this.worker = createWorker(
      require.resolve('./../../../web-workers/swarm_plot.js'),
      this.addGroup.bind(this)
    )

    // send data to the worker in chunks
    let groups = Object.assign(
      {}, ...categoryGroups(category, value, Dots)
    );

    this.setState({ groups });

    Object.values(groups).forEach(
      ({label, values}) => {
        this.worker.postMessage({
          label,
          values,
          width,
          xdomain: xScale.domain(),
          xrange: xScale.range(),
          ydomain: yScale.domain(),
          yrange: yScale.range()
        });
      }
    );
  }

  render(){
    let { series, xScale, yScale, offset, width, color } = this.props;
    let { variables: { category, value } } = series;

    if (category.size != value.size) return null;
    let groups = categoryGroups(category, value, Dots);

    let swarms = groups.map( (group,index_group) => {
      let { label, values } = group;

      if (!values.length) return null;

      let x_position = xScale(label) + offset + width / 2;
      let text_position = xScale(label) + offset;

      const jitter = (value) =>
        ((((1000*value)%12)+12)%12 - 6)*width/12;

      return(
        <g className='swarm-group' key={index_group}>
        {
          values.map( (value, index) =>
            <Dot
              x={ x_position + jitter(value) }
              y={ yScale(value) }
              color={ color }
              text_position={ x_position }
              key={ `dot_${index}` }/>
          )
        }
        </g>
      );
    });

    return <g className='box-series' key='swarms'>{swarms}</g>;
  }
}

export default Swarms;
