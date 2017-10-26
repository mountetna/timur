import { Component } from 'react';
import { selectTemplate } from '../../selectors/magma';
import { selectVerbs } from '../../selectors/predicate';
import Predicate from './predicate';

class RecordPredicate extends Component {
  getChild(verb, new_args) {
    let { return_type, args } = verb;

    if (return_type) return { type: 'terminal', return_type };

    if (args[0] == '::identifier') return this.getAttributeChild(this.props.identifier);

    // all that remains must be an attribute name
    return this.getAttributeChild(new_args[0]);
  }

  getAttributeChild(attribute_name) {
    let { terms, attributes } = this.props;
    let { type, attribute_class, model_name } = attributes[attribute_name];

    // depending on the attribute_class and type we return a child
    switch(attribute_class) {
      case 'Magma::ChildAttribute':
      case 'Magma::ForeignKeyAttribute':
        return { type: 'record', model_name, args: [ null] };
      case 'Magma::TableAttribute':
      case 'Magma::CollectionAttribute':
        return { type: 'model', filters: [], model_name, args: [] };
      case 'Magma::DocumentAttribute':
      case 'Magma::ImageAttribute':
        return { type: 'file', attribute_name, model_name: terms.model_name, args: [ null] };
      case 'Magma::Attribute':
        return this.getAttributeChild2(type, attribute_name, terms.model_name);
    }
  }

  getAttributeChild2(type, attribute_name, model_name) {
    let terms = { model_name, attribute_name, args: [ null ] };
    switch(type) {
      case 'String':
        return { ...terms, type: 'string' };
      case 'Integer':
      case 'Float':
        return { ...terms, type: 'number' };
      case 'DateTime':
        return { ...terms, type: 'date-time' };
    }
  }

  render() {
    let { attribute_names, update, terms, verbs } = this.props;
    let { args } = terms;
    let special = (arg) => arg == 'attribute_name' ? attribute_names : [];
    let child = this.getChild.bind(this);

    return <Predicate
      { ...{terms, update, verbs, special, args, child } }
    />;
  }
}

export default connect(
  (state,props) => {
    let verbs =  selectVerbs(state,'record');
    let { attributes, identifier } = selectTemplate(state, props.terms.model_name);
    let attribute_names = Object.keys(attributes).sort();
    return { verbs, attributes, attribute_names, identifier }
  }
)(RecordPredicate);
