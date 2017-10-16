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

  getChild(verb) {
    let { terms: { model } } = this.props;
    let { return_type } = verb;

    return return_type ? { type: 'terminal', return_type } : { type: 'record', model, args: [] };
  }

  renderModelSelect(model) {
    let { model_names, position, update } = this.props;
    return <Selector defaultValue={ model } 
      showNone="disabled" 
      values={ model_names }
      onChange={ (model) => update(position, { model, filters: [], args: [] }) }/>
  }

  render() {
    // the model predicate has three terms, model, filters, and args
    let { verbs, position, terms, update } = this.props;
    let { model, filters, args, start } = terms;
    let child = this.getChild.bind(this);

    return <Predicate
      { ...{ verbs, args, position, terms, update, child } }
    >
      {
        start ? this.renderModelSelect(model) : null
      }
      { 
        model ? this.renderFilters() : null
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
