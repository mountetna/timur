import React, { Component } from 'react';

// A terminal predicate component, mostly this shows approval if the
// predicate chain is 'done' correctly (mostly useful in filters)
export default class TerminalPredicate extends Component {
  render() {
    let { terminal_type, terms: { return_type } } = this.props;

    let terminalClass, predicateClass;
    
    if (terminal_type == return_type || (!terminal_type && return_type)) {
      terminalClass = 'fa fa-check';
      predicateClass = 'predicate completed';
    }
    else {
      terminalClass = 'fa fa-exclamation';
      predicateClass = 'predicate';
    }

    return(
      <div className={ predicateClass }>
        <span className={ terminalClass } aria-hidden='true'/>
      </div>
    );
  }
}
