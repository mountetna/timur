import { Component } from 'react'
import { selectModelNames } from '../../selectors/magma'

class ModelPredicate extends Component {
  constructor() {
    super()
  }

  renderFilters() {
    return <div className="filter">
      +
    </div>
  }

  update(new_terms) {
    let { position, terms } = this.props
    terms = {
      ...terms,
      ...new_terms
    }
    let { model, filters, verb } = terms
    let child = (model && filters && verb) ? { type: "record", model } : null
    this.props.update(position, new_terms, child)
  }

  renderArguments(verb) {
    return <div className="arguments">
      <Selector defaultValue={ verb } 
        showNone="disabled" 
        values={ this.verbs() }
        onChange={ (verb) => this.update({ verb }) }/>
    </div>
  }

  renderModelSelect(model) {
    return <Selector defaultValue={ model } 
      showNone="disabled" 
      values={ this.props.model_names }
      onChange={ (model) => this.update({ model, filters: [] }) }/>
  }

  render() {
    // the model predicate has three terms, model, filters, and verb
    let { start, position, terms, update } = this.props
    let { model, filters, verb } = terms

    return <div className='predicate'>
      {
        start ? this.renderModelSelect(model) : null
      }
      { 
        model ? this.renderFilters() : null
      }
      {
        model ? this.renderArguments(verb) : null
      }
      </div>
  }
}

export default connect(
  (state,props) => ({
    model_names: selectModelNames(state)
  })
)(ModelPredicate)
