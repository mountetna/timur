import { Component } from 'react'

export default class ValuePredicate extends Component {
  constructor() {
    super()
  }

  render() {
    // the model predicate has three terms, model, filters, and action
    let { type } = this.props
    return <div className='predicate'>
      { type }
      </div>
  }
}
