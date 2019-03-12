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

    if (mode != 'browse') return <div className="value"></div>;

    if (!value || !value.length) return <div className='value'>No data</div>;

    return <div className="value">
      <input placeholder='Filter query' className='filter' type='text' onChange={
        e => this.setState({ current_page: 0, filter: e.target.value })
      }/>
      <input className='export' type='button' value={'\u21af TSV'} onClick={
        () => requestTSV(model_name, record_names)
      }/>
      <ModelViewer
        page_size={ 10 }
        pages={ -1 }
        filter={ filter }
        model_name={ attribute.model_name }
        record_names={ value }/>
    </div>
  }
}
