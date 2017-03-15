import React, { Component } from 'react'

const HelperButton = ({ name, onClick , selected }) => (
  <a style={{paddingLeft: 10, paddingRight: 10}} onClick={onClick}>
    { selected ?
      <i className="fa fa-caret-down" aria-hidden="true" style={{paddingRight: 3}}></i> :
      <i className="fa fa-caret-right" aria-hidden="true" style={{paddingRight: 3}}></i> 
    }
    {name}
  </a>
)

const ManifestName = ({ name, updateName, isUpdating }) => (
  <span style={name ? {marginLeft: 10} : {marginLeft: 10, marginRight: 5, fontStyle: 'italic'}}>
    {name ? name : 'Untitled Manifest'}
  </span>
)

class Toolbar extends Component {
  componentDidMount() {
    this.setState({})
  }

  changeSelectedHelper(helper) {
    const selectedHelper = this.state.selectedHelper === helper ? undefined : helper
    this.setState({...this.state, selectedHelper: selectedHelper})
  }

  helperButtons() {
    return []//['Table', 'Query', 'Functions', 'View Schema']
      .map( helper => {
        const isSelected = this.state ? this.state.selectedHelper === helper : false
        return (
          <HelperButton 
            name={helper} key={helper} 
            onClick={() => this.changeSelectedHelper(helper)} 
            selected={isSelected} 
          />
        ) 
      })
  }

  render() {
    const style = {
      display: 'flex', 
      justifyContent:'flex-start', 
      background:'linear-gradient(to top, #A5CF97, white)', 
      height: 30, 
      alignItems:'center',
      borderStyle: 'solid',
      boxSizing: 'border-box',
      borderWidth: 1,
      width: '100%',
      color: 'forestgreen'
    }

    return (
      <div style={style}>
        <ManifestName />
        { this.helperButtons() }
      </div>
    )
  }
}

export default Toolbar