import React, { Component } from 'react'
import { connect } from 'react-redux'
import { deleteManifestElement, selectManifestElement, toggleManifestElementEditor, addManifestElement } from '../../actions/manifest_editor_actions'
import ElementEditor from './manifest_element_editor'

const mapStateToProps = (state) => ({
  manifest: state.manifestEditor.manifest,
  selected: state.manifestEditor.selectedManifestElement,
  isAddingManifestElement: state.manifestEditor.isAddingManifestElement
})

const mapDispatchToProps = (dispatch) => ({
  deleteElement(key) {
    dispatch(deleteManifestElement(key))
  },
  selectElement(key) {
    dispatch(selectManifestElement(key))
  },
  updateElement(key) {
    dispatch(toggleManifestElementEditor(key))
  },
  toggleManifestElementEditor() {
    dispatch(toggleManifestElementEditor())
  },
  addManifestElement(element) {
    dispatch(addManifestElement(element))
  }
})

class ManifestElements extends Component {
  createElementActions(elements) {
    return Object.keys(this.props.manifest).map(name => {
      if (name === this.props.selected) {
        return (
          <div style={{display: 'flex', alignContent: 'center', minWidth: 40, flexGrow: 1, position: 'relative', backgroundColor: '#D3D3D3'}} onMouseOver={this.props.selectElement.bind(this, name)}>
              <div style={{position: 'absolute', top: 0, left: 0, width: '100%', display: 'flex', alignItems: 'center'}}>
                <div style={{flexGrow: 1, textAlign: 'center'}}>
                  <i className="fa fa-times" aria-hidden="true" onClick={this.props.deleteElement.bind(this, name)}></i>
                </div>
                <div style={{flexGrow: 1, textAlign: 'center'}}>
                  <i className="fa fa-pencil-square-o" aria-hidden="true" onClick={this.props.updateElement.bind(this, name)}></i>
                </div>
              </div>
          </div>
        )
      }

      return (<div style={{display: 'flex', alignContent: 'center', minWidth: 40, flexGrow: 1}} onMouseOver={this.props.selectElement.bind(this, name)}></div>)
    })
  }

  render() {
    return (<div className='manifest-elements-container'>
      
      <div style={{display: 'flex', backgroundColor: 'white', minWidth: 0}}>
        <div style={{minWidth: 100, flexGrow: 1}}>
          <div style={{fontWeight: 'bold', marginLeft:20}}>Name</div>
         {Object.keys(this.props.manifest).map(name => (<div key={name} style={{textOverflow: 'ellipsis', overflow: 'hidden', marginLeft:20, whiteSpace: 'nowrap'}} 
          onMouseOver={this.props.selectElement.bind(this, name)}>@{name}</div>))}
        </div>
        <div style={{flexGrow: 6, minWidth: 100}}>
          <div style={{fontWeight: 'bold', marginLeft:10}}>Expression</div>
         {Object.keys(this.props.manifest).map(name => (<div key={name} style={{textOverflow: 'ellipsis', overflow: 'hidden', marginLeft:10, whiteSpace: 'nowrap'}}
          onMouseOver={this.props.selectElement.bind(this, name)}
          >{this.props.manifest[name]}</div>))}
        </div>
        <div style={{display: 'flex', minWidth: 40, flexGrow: 0.4, flexDirection: 'column'}}>
          <div style={{flexGrow: 1}}></div>
          {this.createElementActions()}
        </div>
      </div>
      { this.props.isAddingManifestElement ? 
          <ElementEditor cancelClick={this.props.toggleManifestElementEditor} updateClick={this.props.addManifestElement}/>: 
          <div style={{backgroundColor: 'white'}}><i style={{marginLeft: 4, color: 'green'}}className="fa fa-plus" aria-hidden="true" onClick={this.props.toggleManifestElementEditor}></i></div>
      }
    </div>)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManifestElements)