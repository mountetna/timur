import { Component } from 'react'

export default class BrowserTab extends Component {
  render() {
    if (!this.props.tab) return <div>
        <span className="fa fa-spinner fa-pulse"/>
      </div>

    return <div id="tab" className={ this.props.name }>
      {
        this.props.tab.panes.map(
          (pane) => {
            return <BrowserPane mode={ this.props.mode }
              pane={ pane }
              name={ pane.name }
              revision={ this.props.revision }
              template={ this.props.template }
              document={ this.props.document }
              key={ pane.name }
              />
          }
        )
      }
    </div>
  }
}
