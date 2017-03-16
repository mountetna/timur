import React, { Component } from 'react'
import { toggleIsTitleUpdating, updateManifestTitle } from '../../actions/manifest_editor_actions'

const mapStateToProps = (state) => ({
  title: state.manifestEditor.title,
  isUpdating: state.manifestEditor.isUpdatingTitle
})

const mapDispatchToProps = (dispatch) => ({
  handleClick() { dispatch(toggleIsTitleUpdating()) },
  handleChange(title) { dispatch(updateManifestTitle(title))}
})

class ManifestTitle extends Component {
  titleToShow() {
    return this.props.title === '' ? 'Untitled manifest' : this.props.title
  }

  handleChange(e) {
    this.props.handleChange(e.target.value)
  }

  render() {
    const style = {
      marginLeft: 10, 
      marginRight: 5,
      fontStyle: this.props.title === '' ? 'italic' : 'normal',
    }
    const titleShown = this.titleToShow()

    return (
      <div style={style} >
        {this.props.isUpdating ? 
          <input autoFocus value={this.props.title} onChange={this.handleChange.bind(this)} 
            onBlur={this.props.handleClick} placeholder={titleShown}>
          </input>: 
          <div onClick={this.props.handleClick} style={{minWidth: 70}}>
            {titleShown}
          </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManifestTitle)