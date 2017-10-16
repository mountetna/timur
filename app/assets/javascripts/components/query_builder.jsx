import { Component } from 'react';
import { requestPredicates, requestModels } from '../actions/magma_actions';
import Magma from '../magma';
import { Animate } from 'react-move';
import ModelPredicate from './query_builder/model';
import RecordPredicate from './query_builder/record';
import ValuePredicate from './query_builder/value';
import TerminalPredicate from './query_builder/terminal';

class QueryBuilder extends Component {
  constructor() {
    super()
    this.state = { 
      predicates: [
        // initially there is an empty model_list predicate
        {
          type: "model",
          start: true
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
    this.props.requestPredicates();
  }

  renderPredicate(terms, position) {
    let { type } = terms;

    let props = {
      type,
      terms,
      position,
      key: position,
      update: this.updatePredicate.bind(this)
    };

    switch(type) {
      case 'model':
        return <ModelPredicate { ...props }/>
      case 'record':
        return <RecordPredicate { ...props }/>
      case 'file':
      case 'string':
      case 'number':
      case 'date-time':
        return <ValuePredicate { ...props }/>
      case 'terminal':
        return <TerminalPredicate { ...props }/>
    }
  }

  render() {
    let [ width, height ] = [ 500, 500 ]
    return <div id="query">
      {
        this.state.predicates.map(this.renderPredicate.bind(this))
      }
    </div>
  }
}

export default connect(
  null,
  {
    requestModels,
    requestPredicates
  }
)(QueryBuilder)
