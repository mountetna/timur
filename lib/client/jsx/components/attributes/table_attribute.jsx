import ModelViewer from '../model_viewer'
import React from 'react'

export default class TableAttribute extends React.Component {
  constructor(props) {
    super(props)
    this.state = { filter: "", current_page: 0 }
  }

  render() {
    let { mode, attribute, value } = this.props;
    let { current_page, filter } = this.state;

    if (mode != 'browse') return <div className='attribute'/>;

    if (!value || !value.length) return <div className='attribute'>No data</div>;

    return <div className='attribute'>
      <input placeholder='Filter query' className='filter' type='text' onChange={
        e => this.setState({ current_page: 0, filter: e.target.value })
      }/>
      <ModelViewer
        page_size={ 10 }
        pages={ -1 }
        filter={ filter }
        model_name={ attribute.link_model_name }
        record_names={ value }/>
    </div>
  }
}
