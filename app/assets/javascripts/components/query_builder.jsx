import { Component } from 'react'
import { requestModels } from '../actions/magma_actions'
import Magma from '../magma'
import { Animate } from 'react-move'
import Predicate from './query_builder/predicate'

class QueryBuilder extends Component {
  constructor() {
    super()
    this.state = { 
      predicates: [
        // initially there is an empty model_list predicate
        {
          type: "start"
        }
      ]
    }
  }

  updatePredicate(position, pred, child=null) {
    let { predicates } = this.state

    predicates[position] = {
      ...predicates[position],
      ...pred
    }

    if (child) {
      predicates = predicates.slice(0,position+1)
      predicates.push(child)
    }

    console.log(predicates)
    this.setState({ predicates })
  }

  componentDidMount() {
    this.props.requestModels();
  }

  render() {
    let [ width, height ] = [ 500, 500 ]
    return <div id="query">
      {
        this.state.predicates.map( (pred, num) => <Predicate type={pred.type} terms={pred} key={num} position={num} update={ this.updatePredicate.bind(this) } /> )
      }
    </div>
  }
}

export default connect(
  null,
  {
    requestModels
  }
)(QueryBuilder)
