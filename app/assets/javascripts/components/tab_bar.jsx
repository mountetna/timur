var TabBar = React.createClass({
  render: function() {
    var self = this

    var view = this.props.view

    var current_tab = view.tabs[ this.props.selected || view.default_tab ]
    
    var skin = this.state.mode == "browse" ?  "browser " + this.props.skin_name : "browser"

    return <div className="tabbar">
      {
        Object.keys(view.tabs).map(function(tab_name) {
          return <div key={ tab_name } class="tab">{ tab_name }</div>
        })
      }
    </div>
  }
})

module.exports = TabBar
