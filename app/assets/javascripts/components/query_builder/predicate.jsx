import { Component } from 'react'
import StartPredicate from './start'
import ModelPredicate from './model'
import RecordPredicate from './record'
import ValuePredicate from './value'

export default class Predicate extends Component {
  render() {
    let { type } = this.props

    switch(type) {
      case 'start':
        return <StartPredicate { ...this.props }/>
      case 'model':
        return <ModelPredicate { ...this.props }/>
      case 'record':
        return <RecordPredicate { ...this.props }/>
      case 'file':
      case 'string':
      case 'number':
      case 'date-time':
        return <ValuePredicate { ...this.props }/>
    }
  }
}
