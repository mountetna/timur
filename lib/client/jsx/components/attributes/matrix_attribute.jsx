import React from 'react';
import MatrixAttributeFilterTable from './matrix_attribute_filter_table';
import MatrixAttributeSearchViewer from './matrix_attribute_search_viewer';

export default class MatrixAttribute extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let {mode, attribute, value: row, record, template, sliceValues} = this.props;
    if (
      !['browse', 'model_viewer'].includes(mode) ||
      row.every((value) => null == value)
    )
      return <div className='attribute' />;

    if (!row || !row.length) return <div className='attribute'>No data</div>;

    let Component =
      'model_viewer' === mode
        ? MatrixAttributeSearchViewer
        : MatrixAttributeFilterTable;

    return (
      <div className='attribute'>
        <Component
          attribute={attribute}
          row={row}
          record={record}
          template={template}
          sliceValues={sliceValues}
        />
      </div>
    );
  }
}
