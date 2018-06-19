import { connect } from 'react-redux';

import React, { Component } from 'react';
import { selectTemplate } from '../../selectors/magma';
import { selectVerbs } from '../../selectors/predicate';
import Predicate from './predicate';
import PredicateChainSet from './predicate_chain_set';

const TYPE_PREDICATES = {
  File: 'file',
  String: 'string',
  TrueClass: 'boolean',
  Integer: 'number',
  Float: 'number',
  DateTime: 'date_time'
};

// A Record Predicate, this maps attributes from the record to the appropriate
// child predicate It also holds what on Magma would be a 'Vector' predicate as
// an Array argument.
class RecordPredicate extends Component {
  getChildren(verb, new_args) {
    let { return_type, args } = verb;

    if (return_type) return [ { type: 'terminal', return_type } ];

    if (args[0] == 'Array') return [ { type: 'terminal', return_type: 'Vector' } ];
    
    if (args[0] == '::metrics') return [ { type: 'terminal', return_type: 'Hash' } ];

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
        return [ { type: 'record', model_name, args: [ null] } ];
      case 'Magma::TableAttribute':
      case 'Magma::CollectionAttribute':
        return [ { type: 'model', filters: [], model_name, args: [] } ];
      case 'Magma::FileAttribute':
      case 'Magma::ImageAttribute':
        return [ { type: 'file', model_name: terms.model_name, attribute_name, args: [] } ];
      case 'Magma::Attribute':
        return this.getAttributeChild2(type, attribute_name, terms.model_name);
    }
  }

  getAttributeChild2(type, attribute_name, model_name) {
    return [
      { type: TYPE_PREDICATES[type], model_name, attribute_name, args: [ null ], completed: true },
      { type: 'terminal', return_type: type }
    ];
  }

  updateVectors(vectors) {
    this.props.update({ args: [ vectors ] });
  }

  addVector() {
    let { terms: { args, model_name } } = this.props;
    let vectors = [ ...args[0] ];

    vectors.push([ { type: 'record', model_name, args: [] } ]);

    this.updateVectors(vectors);
  }

  renderVectors(vectors) {

    return(
      <div className='filters'>
        <PredicateChainSet
          chains={ vectors }
          update={ this.updateVectors.bind(this) }/>
        <span onClick={ this.addVector.bind(this) }
          title='New vector'
          className='new fas fa-plus' aria-hidden='true' />
      </div>
    );
  }

  render() {
    let { attribute_names, update, terms, verbs } = this.props;
    let { args } = terms;
    let special = (arg) => arg == 'attribute_name' ? attribute_names : [];
    let getChildren = this.getChildren.bind(this);
    let vector = this.renderVectors.bind(this);

    let pred_props = {
      terms,
      update,
      verbs,
      special,
      args,
      vector,
      getChildren
    };

    return <Predicate {...pred_props} />;
  }
}

export default connect(
  (state,props) => {
    let verbs =  selectVerbs(state,'record');
    let { attributes, identifier } = selectTemplate(state, props.terms.model_name);
    let attribute_names = Object.keys(attributes).sort();
    return { verbs, attributes, attribute_names, identifier };
  }
)(RecordPredicate);
