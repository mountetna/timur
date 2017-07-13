import TableViewer from '../table_viewer'
import React from 'react'

export default class TableAttribute extends React.Component {
  constructor(props) {
    super(props)
    this.state = { filter: "", current_page: 0 }
  }

  render() {
    if (this.props.mode != 'browse') return <div className="value"></div>

    return <div className="value">
      <TableViewer 
        page_size={ 10 }
        current_page={ this.state.current_page }
        set_page={ (page) => this.setState({ current_page: page }) }
        filter={ this.state.filter }
        set_filter={ (evt) => this.setState({ current_page: 0, filter: evt.target.value }) }
        model_name={ this.props.attribute.model_name }
        record_names={ this.props.value }/>
    </div>
  }
}
