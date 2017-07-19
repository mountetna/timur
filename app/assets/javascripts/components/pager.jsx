var Pager = React.createClass({
  getInitialState: function(){
    return {'editing': false}
  },

  rewind_page: function(){
    if(this.props.current_page > 0){
      this.props.set_page(this.props.current_page - 1);
    }
  },

  advance_page: function(){
    if(this.props.current_page < this.props.pages-1){
      this.props.set_page(this.props.current_page + 1);
    }
  },

  enter_page: function(){
    if(parseInt(this.refs.page_edit.value) == this.refs.page_edit.value){
      var page_edit = parseInt(this.refs.page_edit.value) - 1;
      this.props.set_page(Math.max(0,Math.min(this.props.pages - 1,page_edit)));
    }

    this.setState({'editing': false});
  },

  renderEdit: function(){
    if(!this.state.editing){
      return((this.props.current_page+1)+' of '+this.props.pages);
    }

    var input_props ={
      'className': 'page_edit',
      'ref': 'page_edit',
      'type': 'text',
      'defaultValue': self.props.current_page + 1,
      autoFocus,
      'onBlur': self.enter_page,
      'onEnter': self.enter_page
    };

    return <input {...input_props} />;
  },

  render: function(){

    var left_chevron_props = {'className':'turner inactive fa fa-chevron-left'};
    if(this.props.current_page > 0){
      left_chevron_props['className'] = 'turner active fa fa-chevron-left';
      left_chevron_props['onClick'] = this.rewind_page
    }

    var right_chevron_props={'className':'turner inactive fa fa-chevron-right'};
    if(this.props.current_page < this.props.pages-1){
      right_chevron_props['className'] = 'turner active fa fa-chevron-right';
      right_chevron_props['onClick'] = this.advance_page
    }

    var report_props = {
      'className': 'report',
      'onClick': function(){
        self.setState({'editing': true});
      }
    };

    return(
      <div className='pager'>

        <span {...left_chevron_props} />
        <div {...report_props}>

          {'Page'}
          {this.renderEdit()}
        </div>
        <span {...right_chevron_props} />
        {this.props.children}
      </div>
    );
  }
});

module.exports = Pager;
