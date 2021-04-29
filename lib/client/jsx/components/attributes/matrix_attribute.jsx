import React from 'react';
import MatrixAttributeFilter from './matrix_attribute_filter';
import MatrixAttributeModal from './matrix_attribute_modal';

export default class MatrixAttribute extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {mode, attribute, value: row, record, template} = this.props;
    if (
      !['browse', 'model_viewer'].includes(mode) ||
      row.every((value) => null == value)
    )
      return <div className='attribute' />;

    if (!row || !row.length) return <div className='attribute'>No data</div>;

    let Component =
      'model_viewer' === mode ? MatrixAttributeModal : MatrixAttributeFilter;

    return (
      <div className='attribute'>
        <Component
          attribute={attribute}
          row={row}
          record={record}
          template={template}
        />
      </div>
    );
  }
}
