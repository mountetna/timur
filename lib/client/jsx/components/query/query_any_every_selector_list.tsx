import React, {useState, useCallback} from 'react';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import {makeStyles} from '@material-ui/core/styles';

import {QueryFilter} from '../../contexts/query/query_types';
import {useEffect} from 'react';

const useStyles = makeStyles((theme) => ({
  textInput: {
    margin: theme.spacing(1),
    minWidth: 120,
    paddingLeft: '1rem'
  },
  fullWidth: {
    width: '80%',
    minWidth: 120
  }
}));

const QueryAnyEverySelectorList = ({
  filter,
  index,
  patchRecordFilter
}: {
  filter: QueryFilter;
  index: number;
  patchRecordFilter: (index: number, updatedFilter: QueryFilter) => void;
}) => {
  const [anyMap, setAnyMap] = useState({} as {[key: string]: boolean});
  const classes = useStyles();

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

  return (
    <React.Fragment>
      {Object.entries(anyMap || {}).map(([modelName, value], index: number) => {
        return (
          <Select
            key={index}
            className={classes.fullWidth}
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
