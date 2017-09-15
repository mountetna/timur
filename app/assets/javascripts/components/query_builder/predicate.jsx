import { Component } from 'react'
import ModelPredicate from './model'
import RecordPredicate from './record'

export default class Predicate extends Component {
  render() {
    let { type } = this.props

    switch(type) {
      case 'model':
        return <ModelPredicate { ...this.props }/>
      case 'record':
        return <RecordPredicate { ...this.props }/>
    }
  }
}
