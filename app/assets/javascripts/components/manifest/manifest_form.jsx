import React, { Component } from 'react'
import InputField from './input_field'
import TextField from './text_field'
import ManifestAccess from './manifest_access'
import ManifestElementForm from './manifest_element_form'
import { v4 } from 'node-uuid'

class ManifestForm extends Component {
  componentWillMount() {
    if (this.props.manifest) {
      this.setState({ ...this.props.manifest })

      const elements = this.props.manifest.data.elements || []
      const elementsByKey = elements.reduce((acc, curr) => {
        const key = v4()
        return ({
          keys: [...acc.keys, key],
          elementsByKey: {...acc.elementsByKey, [key]: curr}
        })
      }, { elementKeys: [], elementsByKey: {} })

      this.setState(elementsByKey)
    } else {
      this.setState({
        access: 'private',
        elementKeys: [],
        elementsByKey: {}
      })
    }
  }

  updateField(fieldName) {
    return (value) => this.setState({ [fieldName]: value })
  }

  stateToManifestData(state) {
    const { elementKeys, elementsByKey } = this.state
    const elements = elementKeys.map(key => elementsByKey[key])
    return {
      elements
    }
  }

  save() {
    this.props.save({
      ...this.state,
      data: this.stateToManifestData(this.state)
    })
  }

  addElement() {
    const key = v4()
    this.setState({
      elementKeys: [...this.state.elementKeys, key],
      elementsByKey: {
        ...this.state.elementsByKey,
        [key]: {name:'', description:'', script:''}
      }
    })
  }

  updateElementAttribute(key) {
    return (attribute) => (value) => {
      const updatedElements = {
        ...this.state.elementsByKey,
        [key]: {
          ...this.state.elementsByKey[key],
          [attribute]: value
        }
      }
      this.setState({ elementsByKey: updatedElements })
    }
  }

  removeElement(key) {
    const removedKey = [...this.state.elementKeys].filter(elementKey => {
      if (elementKey !== key) {
        return elementKey
      }
    })
    let removedElement = {...this.state.elementsByKey}
    delete removedElement[key]

    this.setState({
      elementKeys: removedKey,
      elementsByKey: removedElement
    })
  }

  render() {
    const manifestElements = this.state.elementKeys.map((key) => {
      const props = {
        ...this.state.elementsByKey[key],
        updateAttribute: this.updateElementAttribute(key),
        handleRemove: () => this.removeElement(key)
      }

      return (
        <li key={key}>
          <ManifestElementForm {...props} />
        </li>
      )
    })

    return (
      <div>
        <button onClick={this.save.bind(this)}>
          save
        </button>
        <button onClick={this.props.cancel}>
          cancel
        </button>
        <InputField type='text'
          placeholder='e.g. Populations'
          label='Name'
          onChange={this.updateField('name')}
          value={this.state.name}/>
        <InputField type='text'
          placeholder='e.g. Immunoprofiler'
          label='Project'
          onChange={this.updateField('project')}
          value={this.state.project} />
        { this.props.canEditAccess &&
          <ManifestAccess
            selectedDefault={this.state.access}
            handleSelect={this.updateField('access')} />
        }
        { this.state.updated_at && <div>created at: this.state.manifest.updated_at</div> }
        { this.state.user && <div>created by: this.state.manifest.user.name</div> }
        <TextField label='Description'
          onChange={this.updateField('description')}
          value={this.state.description} />
        <div>
          Manifest
        </div>
        <ol>
          <li>
            <button onClick={this.addElement.bind(this)}>add element</button>
          </li>
          {manifestElements}
        </ol>
      </div>
    )
  }
}

export default ManifestForm