Pager = React.createClass({
  getInitialState: function() {
    return { editing: false }
  },
  rewind_page: function() {
    if (this.props.current_page > 0) this.props.set_page(this.props.current_page - 1)
  },
  advance_page: function() {
    if (this.props.current_page < this.props.pages-1) this.props.set_page(this.props.current_page + 1)
  },
  enter_page: function() {
    if (parseInt(this.refs.page_edit.value) == this.refs.page_edit.value)
      this.props.set_page(
        Math.max( 0, Math.min( this.props.pages - 1, parseInt(this.refs.page_edit.value) - 1 ) )
      )
    this.setState({ editing: false })
  },
  render: function() {
    var self = this
    return <div className="pager">
            { 
              (this.props.current_page > 0)
                ?
                  <span className="turner active fa fa-chevron-left" onClick={ this.rewind_page } />
                :
                  <span className="turner inactive fa fa-chevron-left"/>
            }
            <div className="report"
              onClick={
                function() {
                  self.setState({ editing: true })
                }
              }
            >
              Page { 
                this.state.editing 
                  ?
                    <input 
                      className="page_edit" 
                      ref="page_edit" 
                      type="text" 
                      defaultValue={ self.props.current_page + 1 }
                      autoFocus
                      onBlur={ self.enter_page }
                      onEnter={ self.enter_page } />
                  :
                    this.props.current_page + 1 
              } of { this.props.pages }
            </div>
            { 
              (this.props.current_page < this.props.pages-1)
                ? 
                  <span 
                    className="turner active fa fa-chevron-right" 
                    onClick={ this.advance_page }/>
                :
                  <span 
                    className="turner inactive fa fa-chevron-right"/>
            }
            {
              this.props.children
            }
           </div>
  }
})

module.exports = Pager
