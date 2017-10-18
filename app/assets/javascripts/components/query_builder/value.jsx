import { Component } from 'react';
import { selectVerbs } from '../../selectors/predicate';
import { selectTemplate } from '../../selectors/magma';
import Predicate from './predicate';

class ValuePredicate extends Component {
  getChild(verb, new_args) {
    let { return_type, args } = verb;

    if (return_type) return { type: 'terminal', return_type };
  }

  render() {
    // the model predicate has three terms, model, filters, and action
    let { attribute_name, update, position, type, terms, verbs } = this.props;
    let { args } = terms;
    let special = () => [];
    let child = this.getChild.bind(this);
    let inputType = type == 'number' ? 'float' : null;

    return <Predicate
      { ...{position, terms, update, inputType, verbs, special, args, child } }
    />;
  }
}

export default connect(
  (state,props) => {
    let verbs =  selectVerbs(state,props.type);
    let { attributes } = selectTemplate(state, props.terms.model_name);
    let attribute = attributes[props.attribute_name];
    return { verbs, attribute }
  }
)(ValuePredicate);
