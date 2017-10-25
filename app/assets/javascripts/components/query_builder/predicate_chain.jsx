import { Component } from 'react';
import ModelPredicate from './model';
import RecordPredicate from './record';
import ValuePredicate from './value';
import TerminalPredicate from './terminal';

export default class PredicateChain extends Component {
  updatePredicate(position, predicate_update, child=null) {
    let { predicates, update } = this.props;

    let new_predicates = [ ...predicates ];

    new_predicates[position] = {
      ...predicates[position],
      ...predicate_update
    };

    if (child) {
      new_predicates = new_predicates.slice(0,position+1);
      new_predicates.push(child);
    }

    update(new_predicates);
  }

  renderPredicate(terms, position) {
    let { type } = terms;

    let props = {
      type,
      terms,
      key: position,
      update: this.updatePredicate.bind(this, position)
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
    let { predicates } = this.props;

    return <div className='chain'>
      {
        predicates.map(this.renderPredicate.bind(this))
      }
    </div>
  }
}
