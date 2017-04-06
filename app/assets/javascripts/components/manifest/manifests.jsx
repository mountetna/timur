import React, { Component } from 'react'
import { connect } from 'react-redux'

class Manifests extends Component {
  render() {
    return <div>ABC</div>
  }
}

const mapStateToProps = (state) => {
  const manifests = state.timur.manifests
  return {
    manifests
  }
}

export default connect(mapStateToProps)(Manifests)