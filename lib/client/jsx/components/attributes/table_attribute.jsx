import ModelViewer from '../model_viewer'
import React from 'react'

export default class TableAttribute extends React.Component {
  constructor(props) {
    super(props)
    this.state = { current_page: 0 }
  }

  render() {
    let { mode, attribute, value } = this.props;
    let { current_page } = this.state;

    if (mode != 'browse') return <div className="value"/>;

    if (!value || !value.length) return <div className='value'>No data</div>;

    return <div className="value">
      <ModelViewer
        page_size={ 10 }
        pages={ -1 }
        model_name={ attribute.model_name }
        record_names={ value }/>
    </div>
  }
}
