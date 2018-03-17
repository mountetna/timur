import { connect } from 'react-redux';

import React, { Component } from 'react';
import { selectVerbs } from '../../selectors/predicate';
import { selectTemplate } from '../../selectors/magma';
import Predicate from './predicate';
import { FloatInput } from '../inputs/numeric_input';
import SlowTextInput from '../inputs/slow_text_input';

// A Value predicate, mostly sets the terminal type 
class ValuePredicate extends Component {
  getChildren(verb, new_args) {
    let { return_type, args } = verb;

    if (return_type) return [ { type: 'terminal', return_type } ];

    return [];
  }

  getItemInput(type) {
    if (type == 'number') return FloatInput;

    return SlowTextInput;
  }

  render() {
    // the model predicate has three terms, model, filters, and action
    let { attribute_name, update, type, terms, verbs } = this.props;
    let { args } = terms;
    let special = () => [];
    let getChildren = this.getChildren.bind(this);
    let itemInput = this.getItemInput(type);

    let pred_props = {
      terms,
      update,
      itemInput,
      verbs,
      special,
      args,
      getChildren
    };

    return <Predicate {...pred_props} />;
  }
}

export default connect(
  (state,props) => {
    let verbs =  selectVerbs(state,props.type);
    let { attributes } = selectTemplate(state, props.terms.model_name);
    let attribute = attributes[props.attribute_name];
    return { verbs, attribute };
  }
)(ValuePredicate);
