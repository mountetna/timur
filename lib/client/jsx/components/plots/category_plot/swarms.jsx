import React, {Component} from 'react';
import * as d3 from 'd3';
import {interpolateLab} from 'd3-interpolate';
import { categoryGroups } from './category_plot';
import { createWorker, terminateWorker } from '../../../web-workers'
import Link from '../../link';

const Dots = (category_name, values, labels) => ({ category_name, values, labels });

const Dot = ({x,y, xmedian, onHighlight, highlighted_label, label, color, model}) => {
  let dot = <g>
    <circle
      r={2.5}
      cx={ x }
      cy={ y }
      fill={ color }
      stroke='none'
      onMouseOver={ () => onHighlight(label) }
      onMouseOut={ () => onHighlight(null) }
    />
    { label && label == highlighted_label && <text textAnchor={ x > xmedian ? 'end' : 'start' } x={ x + (x > xmedian ? -4 : 4) } y={y} >{label}</text> }
  </g>;

  return <g className='dot'>
   {
     (model && label) ?
       <Link link={
         Routes.browse_model_path(
           TIMUR_CONFIG.project_name,
           model,
           label
         )}>{dot}</Link> : dot
   }
  </g>;
};

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
      { groups: {...groups, [data.category_name]: data } },
      // kill worker when all points are added
      () => {
        if (Object.values(this.state.groups).every(({xvalues}) => xvalues))
          this.killWorker();
      }
    )
  }

  calculateSwarmPoints() {
    let { series, xScale, yScale, width } = this.props;
    let { variables: { category, value, label } } = series;

    // kill potentially busy worker
    this.killWorker();

    // set worker
    this.worker = createWorker(
      require.resolve('./../../../web-workers/swarm_plot.js'),
      this.addGroup.bind(this)
    )

    // send data to the worker in chunks
    let groups = Object.assign(
      {}, ...categoryGroups(category, value, label, Dots)
    );

    this.setState({ groups });

    Object.values(groups).forEach(
      ({category_name, values}) => {
        this.worker.postMessage({
          category_name,
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
    let { series, xScale, yScale, offset, width, color, onHighlight, highlighted_label } = this.props;
    let { variables: { category, value, label, model } } = series;

    if (category.size != value.size) return null;
    let groups = categoryGroups(category, value, label, Dots);

    let swarms = groups.map( (group,index_group) => {
      let { category_name, values, labels } = group;

      if (!values.length) return null;

      let x_position = xScale(category_name) + offset + width / 2;
      let text_position = xScale(category_name) + offset;

      let xmedian = (parseInt(xScale.range()[0]) + parseInt(xScale.range()[1]))/2;

      const jitter = (value) =>
        ((((1000*value)%12)+12)%12 - 6)*width/12;

      return(
        <g className='swarm-group' key={index_group}>
        {
          values.map( (value, index) =>
            <Dot
              x={ x_position + jitter(value) }
              y={ yScale(value) }
              xmedian={ xmedian }
              model={ model }
              color={ color }
              label={ labels[index] }
              onHighlight={ onHighlight }
              highlighted_label={ highlighted_label }
              key={ `dot_${index}` }/>
          )
        }
        </g>
      );
    });

    return <g className='swarm-series' key='swarms'>{swarms}</g>;
  }
}

export default Swarms;
