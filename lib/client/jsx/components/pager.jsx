import React, { Component } from 'react';

class Pager extends Component {
  constructor() {
    super();
    this.state = { editing: false }
  }

  rewindPage() {
    if (this.props.current_page > 1)
      this.props.set_page(this.props.current_page - 1);
  }

  advancePage() {
    if (this.props.current_page < this.props.pages)
      this.props.set_page(this.props.current_page + 1);
  }

  enterPage() {
    let page_edit = parseInt(this.refs.page_edit.value)
    if (page_edit == this.refs.page_edit.value) {
      this.props.set_page(
        Math.max( 1, Math.min( this.props.pages, page_edit ) )
      )
    }
    this.setState({ editing: false })
  }

  renderReport() {
    return <div className='report' onClick={ () => this.setState({ editing: true }) } >
      Page { 
        this.state.editing 
          ? <input className='page_edit'
            ref='page_edit'
            type='text'
            defaultValue={ this.props.current_page }
            autoFocus
            onBlur={ this.enterPage.bind(this) } 
            onEnter={ this.enterPage.bind(this) } />
          : this.props.current_page
      } of { this.props.pages }
    </div>
  }

  renderLeft() {
    if (this.props.current_page > 1) {
      return <span className='turner active fas fa-chevron-left' onClick={ this.rewindPage.bind(this) } />
    } else {
      return <span className='turner inactive fas fa-chevron-left'/>
    }
  }

  renderRight() {
    if (this.props.current_page < this.props.pages) {
      return <span className='turner active fas fa-chevron-right' onClick={ this.advancePage.bind(this) }/>
    } else {
      return <span className='turner inactive fas fa-chevron-right'/>
    }
  }

  render() {
    return <div className='pager'>
      { this.renderLeft() }
      { this.renderReport() }
      { this.renderRight() }
      { this.props.children }
      </div>
  }
}

module.exports = Pager;
