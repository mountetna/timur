import React from 'react';
import {
  useTable,
  usePagination,
  useResizeColumns,
  useFlexLayout,
} from 'react-table'

const headerProps = (props, { column }) => getStyles(props, column.align)

const cellProps = (props, { cell }) => getStyles(props, cell.column.align)

const getStyles = (props, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'flex-start',
      display: 'flex',
    },
  },
]

const TableViewer = ({ page, pages, page_size, setPage, columns, data, children }) => {
  const defaultColumn = React.useMemo(
    () => ({
      // When using the useFlexLayout:
      minWidth: 30, // minWidth is only used as a limit for resizing
      width: 100 // width is used for both the flex-basis and flex-grow
    }),
    []
  )

  const { getTableProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
      defaultColumn,
      manualPagination: true
    },
    useResizeColumns,
    useFlexLayout,
    usePagination
  )

  return (
    <div {...getTableProps()} className="table-viewer">
      <div className='pager'>
        <Prev onClick = { () => (page > 0) && setPage(page - 1) }/>
        <div className='pages'>
          <span className='page-label'>Page</span>
          <input type='number' value={page+1} onChange={ (e) => setPage(e.target.value - 1) }/>
          <span className='page-label'>of { pages }</span>
        </div>
        <Next onClick = { () => (page < pages - 1) && setPage(page + 1) }/>
        { children }
      </div>
      <div className='thead'>
        {headerGroups.map(headerGroup => (
          <div className='tr' {...headerGroup.getHeaderGroupProps({ })}>
            {headerGroup.headers.map(column => (
              <div className='th' {...column.getHeaderProps(headerProps)}>
                <div className='content'>{column.render('Header')}</div>
                {column.canResize && (
                  <div
                    {...column.getResizerProps()}
                    className={`resizer ${
                      column.isResizing ? 'isResizing' : ''
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="tbody">
        {rows.map(row => {
          prepareRow(row)
          return (
            <div {...row.getRowProps()} className="tr">
              {row.cells.map(cell => {
                return (
                  <div {...cell.getCellProps(cellProps)} className="td">
                    {cell.render('Cell')}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const TableButton = ({direction,children,disabled,...props}) =>
  <div className={ `pagination-nav ${disabled ? 'disabled' : ''}` } {...props } disabled={disabled}>
    <i className={ `fas fa-chevron-${direction}`}/>
  </div>;

const Prev = (props) => <TableButton direction='left' {...props}/>;
const Next = (props) => <TableButton direction='right' {...props}/>;

export default TableViewer;
