import React, { Component } from 'react';

var HeaderApprove = React.createClass({
  render: function() {
    return <div className="inline">
        <div className='cancel' onClick={ 
          this.props.handler.bind(null,'cancel')
        }>
        <span className="fa fa-close"/>
        </div>
        <div className='approve' onClick={ 
          this.props.handler.bind(null,'approve')
        }>
        <span className="fa fa-check"/>
        </div>
      </div>
  }
})

var HeaderWaiting = React.createClass({
  render: function() {
    return <div className='submit'>
      <span className="fa fa-spinner fa-pulse"/>
    </div>
  }
})


var HeaderEdit = React.createClass({
  render: function() {
    return <div className='edit' 
      onClick={ this.props.handler.bind(null,'edit') }>
      <span className="fa fa-pencil"/>
      </div>
  }
})

var HeaderClose = React.createClass({
  render: function() {
    return <div 
      onClick={ this.props.handler.bind(null,'close') }
      className="close">
      <span className="fa fa-times-circle"/>
    </div>
  }
})


var Header = React.createClass({
  render: function() {
    var component
    if (this.props.mode == 'edit')
      component = <HeaderApprove handler={ this.props.handler }/>
    else if (this.props.mode == 'submit')
      component = <HeaderWaiting/>
    else if (this.props.can_edit)
      component = <HeaderEdit handler = { this.props.handler }/>
    return <div className="header">
      { this.props.children }
      { component }
      {
        this.props.can_close ?
        <HeaderClose handler={ this.props.handler }/>
        : null
      }
    </div>
  }
})

module.exports = Header
