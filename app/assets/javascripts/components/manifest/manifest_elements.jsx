import React, { Component } from 'react'
import { connect } from 'react-redux'
import { deleteManifestElement, selectManifestElement, 
  toggleManifestElementEditor, addManifestElement, addToUpdateList, removeFromUpdateList } from '../../actions/manifest_editor_actions'
import ElementEditor from './manifest_element_editor'

const mapStateToProps = (state) => ({
  manifest: state.manifestEditor.manifest,
  selected: state.manifestEditor.selectedManifestElement,
  isAddingManifestElement: state.manifestEditor.isAddingManifestElement,
  updatingElementsList: state.manifestEditor.updatingElementList
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
  },
  addToUpdateList(key) {
    dispatch(addToUpdateList(key))
  },
  removeFromUpdateList(key) {
    dispatch(removeFromUpdateList(key))
  }
})

class ManifestElements extends Component {
  cellStyle(elementName) {
    return elementName === this.props.selected ? {backgroundColor: '#CCFFCC'} : {}
  }

  createElementActions(elements) {
    return elements.map(name => {
      if (name === this.props.selected) {
        return (
          <div key={name} className='action-cell' style={this.cellStyle(name)} onMouseOver={this.props.selectElement.bind(this, name)}>
              <div className='action-cell-content'>
                <div>
                  <i className="fa fa-times" aria-hidden="true" onClick={this.props.deleteElement.bind(this, name)}></i>
                </div>
                <div>
                  <i className="fa fa-pencil-square-o" aria-hidden="true" onClick={this.props.addToUpdateList.bind(this, name)}></i>
                </div>
              </div>
          </div>
        )
      }

      return (<div key={name} className='action-cell' onMouseOver={this.props.selectElement.bind(this, name)}></div>)
    })
  }

  createTable(elements, index) {
    const nameCells = elements.map(name => {
      return <div key={name} style={this.cellStyle(name)} className='cell-content name' onMouseOver={this.props.selectElement.bind(this, name)}>@{name}</div>
    })

    const expressionCells = elements.map(name => {
      return <div key={name} style={this.cellStyle(name)} className='cell-content expression' onMouseOver={this.props.selectElement.bind(this, name)}>{this.props.manifest[name]}</div>
    })

    return (
      <div key={index} className='elements-table' onMouseLeave={this.props.selectElement.bind(this)}>
        <div className='actions-column'>
          {this.createElementActions(elements)}
        </div>
        <div className='name-column'>
          {nameCells}
        </div>
        <div className='expression-column'>
          {expressionCells}
        </div>
      </div>
    )
  }

  createContents() {
    const elements = Object.keys(this.props.manifest)
    const updatingList = this.props.updatingElementsList

    //group consecutive non-updating elements to preserve order and put the ElementEditor in the same position 
    const groupedElements = elements.reduce((acc, curr) => {
      if (updatingList.includes(curr)) {
        acc.push(curr)
      } else if (Array.isArray([...acc].pop())) {
        let lastGroup = acc.pop()
        lastGroup.push(curr)
        acc.push(lastGroup)
      } else {
        acc.push([curr])
      }

      return acc
    },[])

    return groupedElements.map((content, index) => {
      //elements that are not in an array is not rendered as part of a table
      if (!Array.isArray(content)) {
        return (
          <ElementEditor key={index} name={content} 
            expression={this.props.manifest[content]} 
            cancelClick={this.props.removeFromUpdateList.bind(this, content)} />
        )
      }

      return this.createTable(content, index)
    }) 
  }

  render() {
    return (
      <div className='manifest-elements-container'>
        <div className='elements-table'>
          <div className='actions-column'>
            <div className='action-cell'></div>
          </div>
          <div className='name-column'>
            <div className='element-header name'>Name<div className='border'></div></div>
          </div>
          <div className='expression-column'>
            <div className='element-header expression'>Expression<div className='border'></div></div>
          </div>
        </div>

        {this.createContents()}
        {this.props.isAddingManifestElement ? 
          <ElementEditor cancelClick={this.props.toggleManifestElementEditor} updateClick={this.props.addManifestElement}/> : 
          <div className='last-section update'>
            <i className="fa fa-plus" aria-hidden="true" onClick={this.props.toggleManifestElementEditor}></i>
          </div>
        }
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManifestElements)