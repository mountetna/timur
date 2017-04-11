import React, { Component } from 'react'
import InputField from './input_field'
import ManifestAccess from './manifest_access'

class NewManifestForm extends Component {
  componentWillMount() {
    this.setState({ 
      access: 'private',
      data: {}
    })
  }

  updateField(fieldName) {
    return (e) => {
      const value = e.target ? e.target.value : e
      this.setState({ [fieldName]: value })
    }
  }

  save() {
    this.props.save(this.state)
  }

  render() {
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
          onChange={this.updateField('name')} />
        <InputField type='text'
          placeholder='e.g. Immunoprofiler'
          label='Project'
          onChange={this.updateField('project')} />
        { this.props.canEditAccess && 
          <ManifestAccess
            selectedDefault={this.state.access}
            handleSelect={this.updateField('access')} />
        }
        <label htmlFor='description'>Description:</label>
        <textarea id='description' 
          onChange={this.updateField('description')}>
        </textarea>
      </div>
    )
  }
}

export default NewManifestForm