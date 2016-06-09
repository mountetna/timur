var TabBar = React.createClass({
  format_name: function(name) {
    return name.replace(/_/, ' ').replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  },
  render: function() {
    var view = this.props.view
    var self = this

    // don't bother showing only one tab
    if (Object.keys(view).length == 1) return <div style={{display:"none"}}/>

    return <div className="tabbar">
      {
        Object.keys(view).map(function(tab_name) {
          if (self.props.current_tab_name == tab_name)
            return <div key={ tab_name } className="selected tab">{ self.format_name(tab_name) }</div>
          else
            return <div key={ tab_name } className={ self.props.revised[tab_name] ? "revised tab" : "tab" } onClick={ function(e) {
              self.props.clickTab(tab_name)
            } }>{ self.format_name(tab_name) }</div>
        })
      }
    </div>
  }
})

TabBar = connect(
  function (state,props) {
    var revised = {}
    var view = props.view

    if (props.mode == 'edit' && props.revision) {
      Object.keys(props.view).forEach(function(tab_name) {
        var tab = props.view[tab_name]
        if (tab) {
          Object.keys(tab.panes).forEach(function(pane_name) {
            if (tab.panes[pane_name].attributes.some(function(name) { return props.revision.hasOwnProperty(name) })) {
              revised[tab_name] = true
              return
            }
          })
        }
      })
    }
    return freshen(
      props,
      {
        revised: revised
      }
    )
  }
)(TabBar)

module.exports = TabBar
