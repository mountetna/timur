import { Component } from 'react';
import Predicate from './predicate'
import { selectModelNames } from '../../selectors/magma';
import { selectVerbs } from '../../selectors/predicate';

class ModelPredicate extends Component {
  renderFilters() {
    return <div className="filter">
      +
    </div>;
  }

  getChild(verb, new_args) {
    let { terms: { model_name } } = this.props;
    let { return_type } = verb;

    return return_type ? { type: 'terminal', return_type } : { type: 'record', model_name, args: [] };
  }

  renderModelSelect(model_name) {
    let { model_names, position, update } = this.props;
    return <Selector defaultValue={ model_name } 
      showNone="disabled" 
      values={ model_names }
      onChange={ (model_name) => update(position, { model_name, filters: [], args: [] }) }/>
  }

  render() {
    // the model predicate has three terms, model_name, filters, and args
    let { verbs, position, terms, update } = this.props;
    let { model_name, filters, args, start } = terms;
    let child = this.getChild.bind(this);

    return <Predicate
      { ...{ verbs, args, position, terms, update, child } }
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
