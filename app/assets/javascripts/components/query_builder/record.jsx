import { Component } from 'react';
import { selectTemplate } from '../../selectors/magma';

class RecordPredicate extends Component {
  constructor() {
    super();

    this.state = { showList: false }
  }

  renderFilters() {
    return <div className="filter">
      +
    </div>
  }

  update(new_terms) {
    let { position, terms } = this.props;
    terms = {
      ...terms,
      ...new_terms
    };
    let { model, action, arg } = terms;

    let child = this.getChild(action,arg);

    this.props.update(position, new_terms, child)
  }

  getChild(action, arg) {
    if (!action) return null

    if (action == '::has' && arg) return { type: 'terminal-boolean' }; 
    if (action == '::metrics') return { type: 'terminal-hash' };
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

  actions() {
    return [ '::has', '::metrics', '::identifier' ].concat(this.props.attribute_names)
  }

  renderAction(action, arg) {
    if (action == '::has') {
      return <Selector defaultValue={ arg } 
        showNone="disabled" 
        values={ this.props.attribute_names }
        onChange={ (arg) => this.update({ arg }) }/>
    }

    return null
  }

  render() {
    // the model predicate has three terms, model, filters, and action
    let { position, terms } = this.props;
    let { model, action, arg } = terms;

    // for this predicate, if the argument is 'has', we need an additional selector
    return <div className='predicate'>
      <Selector defaultValue={ action } 
        showNone="disabled" 
        values={ this.actions() }
        onChange={ (action) => this.update({ action, arg: null }) }/>
      {
        this.renderAction(action, arg)
      }
      </div>
  }
}

export default connect(
  (state,props) => {
    let template = selectTemplate(state, props.terms.model);
    let attribute_names = Object.keys(template.attributes).sort();
    return {
      attributes: template.attributes,
      attribute_names,
      identifier: template.identifier
    }
  }
)(RecordPredicate)
