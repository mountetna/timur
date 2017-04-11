import React, { Component } from 'react'
import InputField from './input_field'
import ManifestFilters from './manifest_filters'

class NewManifestForm extends Component {
  componentWillMount() {
    this.setState({ access: 'private' })
  }

  updateField(fieldName) {
    return (e) => {
      const value = e.target ? e.target.value : e
      this.setState({ [fieldName]: value })
    }
  }

  render() {
    return (
      <div>
        <button>save</button>
        <button>cancel</button>
        <InputField type='text'
          placeholder='Manifest Title'
          label='Title'
          onChange={this.updateField('name')} />
        <InputField type='text'
          placeholder='Project Name'
          label='Project'
          onChange={this.updateField('project')} />
        { this.props.canEditAccess && 
          <ManifestFilters
            label='Access:'
            selectedFilter={this.state.access}
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