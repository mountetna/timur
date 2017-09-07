import React, { Component } from 'react'
import InputField from './input_field'
import TextField from './text_field'
import ManifestAccess from './manifest_access'
import ManifestElementForm from './manifest_element_form'
import Dates from '../../dates'
import { v4 } from 'node-uuid'
import { requestConsignments } from '../../actions/consignment_actions'
import { selectConsignment } from '../../selectors/consignment'
import { manifestToReqPayload, saveNewManifest, saveManifest, toggleEdit } from '../../actions/manifest_actions'

// Edit and save changes to a manifest.  Requests a consignment
// based on edited data when 'test' is clicked
class ManifestForm extends Component {
  componentWillMount() {
    if (this.props.manifest) {
      const elements = this.props.manifest.data.elements || []
      const elementsByKey = elements.reduce((acc, curr) => {
        const key = v4()
        return ({
          elementKeys: [...acc.elementKeys, key],
          elementsByKey: {...acc.elementsByKey, [key]: curr}
        })
      }, { elementKeys: [], elementsByKey: {} }) 
      this.setState(
        { 
          ...this.props.manifest,
          ...elementsByKey,
          hasConsignment: false
        }
      )
    } else {
      this.setState({
        name: '',
        access: 'private',
        elementKeys: [],
        elementsByKey: {},
        hasConsignment: false
      })
    }
  }

  updateField(fieldName) {
    return (value) => this.setState(
      { [fieldName]: value }
    )
  }

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
    this.props.saveNewManifest(this.stateToManifest())
  }

  update() {
    this.props.saveManifest(this.stateToManifest())
  }

  updateResults() {
    this.props.requestConsignments(
      [
        {
          ...manifestToReqPayload(this.stateToManifest()),
          name: 'editing-manifest'
        }
      ],
      () => this.setState({hasConsignment: true})
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
        { elementsByKey: updatedElements }
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
      { elementKeys: removedKey, elementsByKey: removedElement }
    )
  }

  render() {
    const elements = this.state.elementKeys || []
    const { name } = this.state
    const { consignment } = this.props
    const manifestElements = elements.map((key) => {
      const element = this.state.elementsByKey[key]

      let elementResult
      if (consignment && this.state.hasConsignment) {
        if (consignment[element.name]) {
          elementResult = consignment[element.name]
        } else if (!consignment[element.name]) {
          elementResult = ''
        } else if (typeof consignment  === 'string' || consignment.hasOwnProperty('errors') || consignment.hasOwnProperty('error')) { //handle error results
          elementResult = consignment
        } else elementResult = ''
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
          <button onClick={this.props.toggleEdit}>
            <i className='fa fa-ban' aria-hidden="true"></i>
            cancel
          </button>
        </div>
        <InputField type='text'
          placeholder='Manifest Name'
          label='Name'
          onChange={this.updateField('name')}
          value={this.state.name}/>
        <TextField label='Description'
          onChange={this.updateField('description')}
          placeholder='Describe what this manifest does'
          value={this.state.description} />
        { this.props.isAdmin &&
          <ManifestAccess
            selectedDefault={this.state.access}
            handleSelect={this.updateField('access')} />
        }
        <div>
          <button
            onClick={
              () => this.updateResults(this.props.manifest)
            }>
            <i className='fa fa-play' aria-hidden="true"></i>
            test
          </button>
        </div>
        <div className='element-form-container'>
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

export default connect(
  (state,props) => ({
    consignment: selectConsignment(state,'editing-manifest')
  }),
  {
    saveNewManifest,
    saveManifest,
    toggleEdit,
    requestConsignments 
  }
)(ManifestForm)
