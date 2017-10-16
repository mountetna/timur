import { Component } from 'react'

export default class TerminalPredicate extends Component {
  constructor() {
    super()
  }

  render() {
    // the model predicate has three terms, model, filters, and action
    let { terms: { return_type } } = this.props
    return <div className='predicate'>
      { return_type }
      </div>
  }
}
