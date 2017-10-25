import { Component } from 'react';
import PredicateChain from './predicate_chain';

export default class PredicateChainSet extends Component {
  updateChain(chain_position, chain_update) {
    let { chains, update } = this.props;

    let new_chains = [ ...chains ];

    new_chains[chain_position] = chain_update;

    update(new_chains);
  }

  render() {
    let { chains, terminal_type } = this.props;

    return <div className='chainset'>
      {
        chains.map( (predicates, position) => 
          <PredicateChain 
            update={ this.updateChain.bind(this, position) }
            terminal_type={ terminal_type }
            predicates={ predicates }
            key={ position }
          />
        )
      }
    </div>;
  }
}
