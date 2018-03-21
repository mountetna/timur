import React, { Component } from 'react';
import PredicateChain from './predicate_chain';

// This is a component to render a list of predicate chains, where each chain
// is a list of predicates.
export default class PredicateChainSet extends Component {
  updateChain(chain_position, chain_update) {
    let { chains, update } = this.props;

    let new_chains = [ ...chains ];

    new_chains[chain_position] = chain_update;

    update(new_chains);
  }

  renderChains(){
    let {chains, terminal_type} = this.props;
    return chains.map((predicates, position)=>{ 
      let chain_props = {
        update: this.updateChain.bind(this, position),
        terminal_type: terminal_type,
        predicates: npredicates,
        key: position
      };

      return <PredicateChain {...chain_props} />
    })
  }

  render(){
    return(
      <div className='chainset'>
        
        {this.renderChains()}
      </div>
    );
  }
}
