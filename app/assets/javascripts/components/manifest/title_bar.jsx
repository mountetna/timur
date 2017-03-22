import React, { Component } from 'react'
import { connect } from 'react-redux'
import ManifestTitle from './title'
import { submitManifest } from '../../actions/manifest_editor_actions'

const Titlebar = ({ submitManifest }) => (
  <div className='title-bar-container' >
    <ManifestTitle />
    <div className='actions-container'>
      <div onClick={submitManifest}>
        Submit
        <i className="fa fa-play" aria-hidden="true"></i>
      </div>
    </div>
  </div>
)

export default connect(
  null, 
  { submitManifest }
)(Titlebar)


  // componentDidMount() {
  //   this.setState({})
  // }

  // changeSelectedHelper(helper) {
  //   const selectedHelper = this.state.selectedHelper === helper ? undefined : helper
  //   this.setState({...this.state, selectedHelper: selectedHelper})
  // }
  //TODO add helpers to generate table queries etc...
  // helperButtons() {
  //   return []//['Table', 'Query', 'Functions', 'View Schema']
  //     .map( helper => {
  //       const isSelected = this.state ? this.state.selectedHelper === helper : false
  //       return (
  //         <HelperButton 
  //           name={helper} key={helper} 
  //           onClick={() => this.changeSelectedHelper(helper)} 
  //           selected={isSelected} 
  //         />
  //       ) 
  //     })
  // }
// const HelperButton = ({ name, onClick , selected }) => (
//   <a style={{paddingLeft: 10, paddingRight: 10}} onClick={onClick}>
//     { selected ?
//       <i className="fa fa-caret-down" aria-hidden="true" style={{paddingRight: 3}}></i> :
//       <i className="fa fa-caret-right" aria-hidden="true" style={{paddingRight: 3}}></i> 
//     }
//     {name}
//   </a>
// )