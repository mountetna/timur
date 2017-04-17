import React, { Component } from 'react'
import InputField from './input_field'
import TextField from './text_field'
import ManifestAccess from './manifest_access'
import ManifestElementForm from './manifest_element_form'
import ManifestResults from './manifest_results'
import { v4 } from 'node-uuid'

class ManifestForm extends Component {
  componentWillMount() {
    if (this.props.manifest) {
      this.setState(
        { ...this.props.manifest },
        () => {
          const elements = this.props.manifest.data.elements || []

          console.log(elements)
          const elementsByKey = elements.reduce((acc, curr) => {
            const key = v4()
            return ({
              elementKeys: [...acc.elementKeys, key],
              elementsByKey: {...acc.elementsByKey, [key]: curr}
            })
          }, { elementKeys: [], elementsByKey: {} })

          this.setState(elementsByKey)

          if (!this.props.manifest.result) {
            this.updateResults(this.props.manifest)
          }
        }
      )
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
  //TODO
  //SHOW ERROR MESSAGES
  stateToManifest() {
    const { elementKeys, elementsByKey } = this.state
    const keys = elementKeys || []
    const elements = keys.map(key => elementsByKey[key])
    return {
      ...this.state,
      data: { elements }
    }
  }

  create() {
    this.props.create(this.stateToManifest())
  }

  update() {
    this.props.update(this.stateToManifest())
  }

  updateResults() {
    this.props.updateResults(
      this.stateToManifest(),
      (result) => {
        this.setState({ result })
      }
    )
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
      this.setState(
        { elementsByKey: updatedElements },
        this.updateResults
      )
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

    this.setState(
      { elementKeys: removedKey, elementsByKey: removedElement },
      this.updateResults
    )
  }

  render() {
    const elements = this.state.elementKeys || []
    const { result, name } = this.state
    const manifestElements = elements.map((key) => {
      const element = this.state.elementsByKey[key]

      let elementResult
      if (result) {
        if (result[name] && result[name][element.name]) {
          elementResult = result[name][element.name]
        } else if (result[name] && !result[name][element.name]) {
          elementResult = ''
        } else if (!result[name]) {
          elementResult = result
        }
      } else {
        elementResult = ''
      }

      const props = {
        element: this.state.elementsByKey[key],
        updateAttribute: this.updateElementAttribute(key),
        handleRemove: () => this.removeElement(key),
        result: elementResult
      }

      return (
        <li key={key}>
          <ManifestElementForm {...props} />
        </li>
      )
    })

    return (
      <div className='form-container'>
        <div className='actions'>
          { !this.props.manifest ?
            <button onClick={this.create.bind(this)}>
              <i className='fa fa-floppy-o' aria-hidden="true"></i>
              save as
            </button> :
            <button onClick={this.update.bind(this)}>
              <i className='fa fa-floppy-o' aria-hidden="true"></i>
              save
            </button>
          }
          <button onClick={this.props.cancel}>
            <i className='fa fa-ban' aria-hidden="true"></i>
            cancel
          </button>
        </div>
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
        { this.state.updated_at && <div>created at: {this.state.updated_at}</div> }
        { this.state.user && <div>created by: {this.state.user.name}</div> }
        <TextField label='Description'
          onChange={this.updateField('description')}
          value={this.state.description} />
        <div className='element-form-container'>
          <span className='title'>Manifest Items</span>
          <ol>
            {manifestElements}
          </ol>
          <a href='javascript:void(0)' onClick={this.addElement.bind(this)} className="new">
            <i className="fa fa-plus" aria-hidden="true"></i>
            item
          </a>
        </div>
      </div>
    )
  }
}

export default ManifestForm
