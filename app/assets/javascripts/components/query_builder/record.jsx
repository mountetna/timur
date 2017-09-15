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
    let { attribute_class, type } = attribute;

    // depending on the attribute_class and type we return a child
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
