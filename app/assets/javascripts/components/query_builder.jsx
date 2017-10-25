import { Component } from 'react';
import { requestPredicates, requestModels } from '../actions/magma_actions';
import Magma from '../magma';
import { Animate } from 'react-move';
import PredicateChainSet from './query_builder/predicate_chain_set';

class QueryBuilder extends Component {
  constructor() {
    super()
    this.state = { 
      query: [
        [
          // initially there is an empty model_list predicate
          {
            type: 'model',
            start: true
          }
        ]
      ]
    }
  }

  updateQuery(query) {
    this.setState({ query });
    console.log('Query');
    console.log(query);
  }

  componentDidMount() {
    this.props.requestModels();
    this.props.requestPredicates();
  }


  render() {
    let { query } = this.state;
    return <div id='query'>
      <PredicateChainSet chains={ query }
        update={ this.updateQuery.bind(this) }
      />
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
