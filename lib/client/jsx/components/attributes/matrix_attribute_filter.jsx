import React, {useState, useEffect} from 'react';
import TableViewer from 'etna-js/components/table_viewer';

export default function MatrixAttributeFilter({attribute, row}) {
  const [filter, setFilter] = useState('');
  const [filteredData, setFilteredData] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [page, setPage] = useState(0);

  const page_size = 10;

  function updateFilteredData() {
    setFilteredData(
      row
        .map((value, i) => ({
          row_name: attribute.options[i],
          value
        }))
        .filter(({row_name}) => new RegExp(filter).test(row_name))
    );
  }

  useEffect(() => {
    updateFilteredData();
  }, []);

  useEffect(() => {
    updateFilteredData();
  }, [filter, page]);

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      setPageData(filteredData.slice(page * page_size, (page + 1) * page_size));
    }
  }, [filteredData, page]);

  let columns = [
    {
      Header: 'label',
      accessor: 'row_name'
    },
    {
      Header: attribute.name,
      accessor: 'value'
    }
  ];

  if (!filteredData || !pageData) return null;

  return (
    <React.Fragment>
      <input
        placeholder='Filter query'
        className='filter'
        type='text'
        onChange={(e) => setFilter(e.target.value)}
      />
      <TableViewer
        pages={Math.floor(filteredData.length / page_size) + 1}
        page={page}
        page_size={page_size}
        setPage={setPage}
        columns={columns}
        data={pageData}
      />
    </React.Fragment>
  );
}
