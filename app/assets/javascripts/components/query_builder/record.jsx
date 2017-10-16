import { Component } from 'react';
import { selectTemplate } from '../../selectors/magma';
import Predicate from './predicate'
import { selectVerbs } from '../../selectors/predicate';

class RecordPredicate extends Component {
  getChild(verb) {
    let { return_type } = verb;

    return return_type ? { type: 'terminal', return_type } : 
      { type: 'record', model, args: [] };

    if (action == '::identifier') return this.getAttributeChild(this.props.identifier)
    return this.getAttributeChild(action)
  }

  getAttributeChild(attribute_name) {
    let attribute = this.props.attributes[attribute_name];
    let { attribute_class, model_name } = attribute;

    // depending on the attribute_class and type we return a child
    console.log("Getting attribute "+attribute_name);

    switch(attribute_class) {
      case 'Magma::ChildAttribute':
      case 'Magma::ForeignKeyAttribute':
        return { type: 'record', model: model_name };
      case 'Magma::TableAttribute':
      case 'Magma::CollectionAttribute':
        return { type: 'model', filters: [], model: model_name };
      case 'Magma::DocumentAttribute':
      case 'Magma::ImageAttribute':
        return { type: 'file', attribute_name };
      case 'Magma::Attribute':
        return this.getAttributeChild2(attribute);
    }
  }

  getAttributeChild2(attribute) {
    switch(attribute.type) {
      case 'String':
        return { type: 'string' };
      case 'Integer':
      case 'Float':
        return { type: 'number' };
      case 'DateTime':
        return { type: 'date-time' };
    }
  }

  render() {
    let { attribute_names, update, position, terms, verbs } = this.props;
    let { args } = terms;
    let special = (arg) => arg == 'attribute_name' ? attribute_names : [];
    let child = this.getChild.bind(this);

    return <Predicate
      { ...{position, terms, update, verbs, special, args, child } }
    />;
  }
}

export default connect(
  (state,props) => {
    let verbs =  selectVerbs(state,'record');
    let { attributes, identifier } = selectTemplate(state, props.terms.model);
    let attribute_names = Object.keys(attributes).sort();
    return { verbs, attributes, attribute_names, identifier }
  }
)(RecordPredicate)
