import { Component } from 'react';
import Predicate from './predicate';
import PredicateChainSet from './predicate_chain_set';
import { selectModelNames } from '../../selectors/magma';
import { selectVerbs } from '../../selectors/predicate';

class ModelPredicate extends Component {
  updateFilters(filters) {
    this.props.update({ filters })
  }

  addFilter() {
    let { terms: { filters, model_name } } = this.props;

    filters = [ ...filters ];

    filters.push([ { type: 'record', model_name, args: [] } ]);

    this.updateFilters(filters);
  }

  renderFilters() {
    let { terms } = this.props;
    let { filters } = terms;

    return <div className='filters'>
      <PredicateChainSet
        chains={ filters }
        update={ this.updateFilters.bind(this) }/>
      <span onClick={ this.addFilter.bind(this) }
        title='New filter'
        className='new fa fa-plus' aria-hidden='true' />
    </div>;
  }

  getChild(verb, new_args) {
    let { terms: { model_name } } = this.props;
    let { return_type } = verb;

    return return_type ? { type: 'terminal', return_type } : { type: 'record', model_name, args: [] };
  }

  renderModelSelect(model_name) {
    let { model_names, update } = this.props;
    return <Selector defaultValue={ model_name } 
      showNone='disabled' 
      values={ model_names }
      onChange={ (model_name) => update({ model_name, filters: [], args: [] }) }/>
  }

  render() {
    // the model predicate has three terms, model_name, filters, and args
    let { verbs, terms, update } = this.props;
    let { model_name, args, start } = terms;
    let child = this.getChild.bind(this);

    return <Predicate
      { ...{ verbs, args, terms, update, child } }
    >
      {
        start ? this.renderModelSelect(model_name) : null
      }
      { 
        model_name ? this.renderFilters() : null
      }
    </Predicate>
  }
}

export default connect(
  (state,props) => ({
    model_names: selectModelNames(state),
    verbs: selectVerbs(state,'model')
  })
)(ModelPredicate)
