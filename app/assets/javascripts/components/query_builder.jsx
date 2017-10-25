import { Component } from 'react';
import { requestPredicates, requestModels } from '../actions/magma_actions';
import Magma from '../magma';
import { Animate } from 'react-move';
import PredicateChainSet from './query_builder/predicate_chain_set';

const predicateArray = (predicate) => {
  let { type, filters, model_name, args } = predicate;
  switch(type) {
    case 'model':
      let ary = [ model_name ]
      if (filters.length) ary = ary.concat( filters.map(chainArray) )
      return ary.concat(args);
    case 'terminal':
      return [];
    default:
      return args.filter(x=>x!=null);
  }
}

const chainArray = (chain) => chain.map(predicateArray).reduce(
  (predArray,pred) => predArray.concat(pred),
  []
);

const predicateComplete = (predicate) => predicate.completed || predicate.type == 'terminal';

const formatChainArray = (terms) => {
  return `[ ${
    terms.map(term => {
      if (typeof(term) == 'string') return `'${term}'`;
      if (Array.isArray(term)) return formatChainArray(term);
      return term;
    }).join(', ')
    } ]`;
}

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

  renderQuery() {
    let { query } = this.state;
    let predicates = query[0];

    if (!predicates.every(predicateComplete)) {
      return <div className='query'> Incomplete query </div>;
    }

    let queryArray = chainArray(predicates);
    console.log(queryArray);
    let queryString = formatChainArray(queryArray);

    return <div className='query'>
      { queryString }
    </div>
  }

  render() {
    let { query } = this.state;
    return <div id='query'>
      <PredicateChainSet chains={ query }
        update={ this.updateQuery.bind(this) }
      />

      {
        this.renderQuery()
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
