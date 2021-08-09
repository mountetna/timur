import React, {useContext, useState, useCallback} from 'react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {QueryContext} from '../../contexts/query/query_context';
import {QueryFilter} from '../../contexts/query/query_types';
import {useEffect} from 'react';

const QueryAnyEverySelectorList = ({
  filter,
  index
}: {
  filter: QueryFilter;
  index: number;
}) => {
  const [anyMap, setAnyMap] = useState({} as {[key: string]: boolean});
  const {state, patchRecordFilter} = useContext(QueryContext);

  const handlePatchFilter = useCallback(
    (modelName: string) => {
      let copy = {
        ...filter,
        anyMap: {
          ...filter.anyMap,
          [modelName]: !filter.anyMap[modelName]
        }
      };
      patchRecordFilter(index, copy);
    },
    [patchRecordFilter, index, filter]
  );

  useEffect(() => {
    setAnyMap(filter.anyMap);
  }, [filter.anyMap]);

  if (!state.rootModel) return null;

  return (
    <React.Fragment>
      {Object.entries(anyMap || {}).map(([modelName, value], index: number) => {
        return (
          <Select
            key={index}
            fullWidth={true}
            value={value.toString()}
            onChange={() => handlePatchFilter(modelName)}
            name={`any-every-filter-toggle-${index}`}
          >
            <MenuItem value={'true'}>Any {modelName}</MenuItem>
            <MenuItem value={'false'}>Every {modelName}</MenuItem>
          </Select>
        );
      })}
    </React.Fragment>
  );
};

export default QueryAnyEverySelectorList;
