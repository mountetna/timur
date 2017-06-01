import { Component } from 'react'
import { requestModels } from '../actions/magma_actions'
import Magma from '../magma'

class ModelNodeZ extends Component {
  center() {
    if (this.props.depth == 1) return [ this.props.width/2, this.props.height/2 ]

    // compute the midpoint of the arc and get r, theta
    let th = (this.props.arc[1] + this.props.arc[0])/2

    // the first point has a radius of r - r / 2, the next of r - r / 4, the
    // next of r - r / 8
    let r = this.props.width * 3 * (1 - Math.pow(1 / this.props.depth, 0.1))
    return [
      this.props.width / 2 + r * Math.cos(Math.PI * th / 180),
      this.props.height / 2 + r * Math.sin(Math.PI * th / 180)
    ]
  }
  subtend(i) {
    let gap_size = (this.props.arc[1] - this.props.arc[0]) / this.props.link_model_names.length
    return [
      this.props.arc[0] + i * gap_size,
      this.props.arc[0] + (i+1) * gap_size
    ]
  }
  render() {
    let { model_name, depth } = this.props
    let [ x, y ] = this.center()
    return <g>
      {
        this.props.depth > 1 ?
          <line x1={x} y1={y}
            x2={this.props.parent_position[0]} y2={this.props.parent_position[1]}/>
          : null
      }
      {
        this.props.link_model_names.map((link_model_name,i) =>
          <ModelNode
            key={i}
            width={this.props.width}
            height={this.props.height}
            depth={depth + 1}
            arc={ this.subtend(i) }
            parent_position={ [ x, y ] }
            parent_name={ this.props.model_name }
            handler={ this.props.handler }
            model_name={ link_model_name }/>
        )
      }
      <g transform={ `translate(${x},${y})` }
        className="model_node"
        onClick={ () => this.props.handler(this.props.model_name) }>
        <circle 
          r={ 40 / depth }
          cx={0}
          cy={0}/>
        <text style={{fontSize: 16 / Math.pow(depth, 0.3333) }} dy="0.4em" textAnchor="middle">
          { model_name }
        </text>
      </g>
    </g>
  }
}

const ModelNode = connect(
  (state,props) => {
    let magma = new Magma(state)
    let template = magma.template(props.model_name)
    let link_model_names = []
    if (template) {
      link_model_names = Object.keys(template.attributes).filter(
        (att_name) => {
          let link_model_template = magma.template(template.attributes[att_name].model_name)
          if (!link_model_template) return false
          if (link_model_template.name == props.parent_name) return false
          if (link_model_template.parent != props.model_name
          && template.parent != link_model_template.name) return false
          return true
        }
      )
    }

    return {
      link_model_names: link_model_names
    }
  }
)(ModelNodeZ)

class ModelAttribute extends Component {
  type() {
    let attribute = this.props.template.attributes[this.props.att_name]

    if (attribute.type) return attribute.type

    return attribute.attribute_class.replace(/Magma::/,'').replace('Attribute','')
  }
  render() {
    let { att_name, template } = this.props
    let attribute = template.attributes[att_name]
    return <div className="attribute" key={ att_name }>
      <span>{att_name}</span>
      <span className="type">({this.type()})</span>
      { attribute.desc ?
      <span className="description">{ attribute.desc }</span>
          : null
      }
    </div>
  }
}

class ModelReport extends Component {
  render() {
    let { model_name, template } = this.props
    if (!template) return <div/>
    return <div className="report">
      <span className="title">{model_name}</span>
      <span className="description">{template.description}</span>
      {
        Object.keys(template.attributes).map((att_name,i) =>
          template.attributes[att_name].shown ? 
          <ModelAttribute key={i} att_name={att_name} template={template}/>
          : null
        )
      }
    </div>
  }
}

ModelReport = connect(
  (state,props) => {
    let magma = new Magma(state)
    return {
      template: magma.template(props.model_name)
    }
  }
)(ModelReport)

class ModelMap extends Component {
  constructor() {
    super()
    this.state = { current_model: "project" }
  }
  componentDidMount() {
    this.props.requestModels()
  }
  showModel(model_name) {
    console.log('click')
    this.setState( { current_model: model_name } )
  }
  render() {
    let [ width, height ] = [ 500, 500 ]
    return <div id="map">
      <svg width={width} height={height}>
        <ModelNode 
          width={width}
          height={height}
          depth={1}
          arc={ [ 0, 360 ] }
          handler={ this.showModel.bind(this) }
          model_name={ this.state.current_model }/>
      </svg>
      <ModelReport model_name={ this.state.current_model }/>
    </div>
  }
}

export default connect(
  (state) => {
    var magma = new Magma(state)
    return {
      model_names: magma.model_names()
    }
  },
  {
    requestModels
  }
)(ModelMap)
