import React, { Component } from 'react';

// A terminal predicate component, mostly this shows approval if the
// predicate chain is 'done' correctly (mostly useful in filters)
export default class TerminalPredicate extends Component {
  render() {
    let { terminal_type, terms: { return_type } } = this.props;

    let terminal_class, predicate_class;
    
    if (terminal_type == return_type || (!terminal_type && return_type)) {
      terminal_class = 'fas fa-check';
      predicate_class = 'predicate completed';
    }
    else {
      terminal_class = 'fas fa-exclamation';
      predicate_class = 'predicate';
    }

    return(
      <div className={predicate_class}>
        <span className={terminal_class} aria-hidden='true'/>
      </div>
    );
  }
}
