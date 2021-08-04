import React, {useContext, useState, useCallback} from 'react';

import AntSwitch from './ant_switch';
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
          <AntSwitch
            key={index}
            checked={value}
            onChange={() => handlePatchFilter(modelName)}
            name={`any-every-filter-toggle-${index}`}
            leftOption={`Every ${modelName}`}
            rightOption={`Any ${modelName}`}
          />
        );
      })}
    </React.Fragment>
  );
};

export default QueryAnyEverySelectorList;
