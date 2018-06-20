import React, { Component } from 'react';
import ModelPredicate from './model';
import RecordPredicate from './record';
import ValuePredicate from './value';
import TerminalPredicate from './terminal';

/*
 * This is a predicate chain, it renders a list of predicates, determining the
 * correct predicate component for the given type.
 */
export default class PredicateChain extends Component {
  updatePredicate(position, predicate_update, ...children) {
    let { predicates, update } = this.props;

    let new_predicates = [ ...predicates ];

    new_predicates[position] = {
      ...predicates[position],
      ...predicate_update
    };

    if (children.length) {
      new_predicates = new_predicates.slice(0,position+1).concat(children);
    }

    update(new_predicates);
  }

  renderPredicate(terms, position) {
    let { terminal_type } = this.props;
    let { type } = terms;

    let props = {
      type,
      terms,
      key: position,
      update: this.updatePredicate.bind(this, position)
    };

    switch(type) {
      case 'model':
        return <ModelPredicate { ...props }/>;
      case 'record':
        return <RecordPredicate { ...props }/>;
      case 'file':
      case 'string':
      case 'number':
      case 'date_time':
        return <ValuePredicate { ...props }/>;
      case 'terminal':
        return <TerminalPredicate terminal_type={terminal_type} {...props}/>;
    }
  }

  render() {
    let { predicates } = this.props;

    return(
      <div className='chain'>

        {predicates.map(this.renderPredicate.bind(this))}
      </div>
    );
  }
}
