import React, {useMemo, useContext, useState} from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import {useReduxState} from 'etna-js/hooks/useReduxState';
import {selectModels} from 'etna-js/selectors/magma';

import {QueryContext} from '../../contexts/query/query_context';
import QuerySliceModelAttributePane from './query_slice_model_attribute_pane';
import {QueryFilter} from '../../contexts/query/query_types';
import {
  selectMatrixModelNames,
  selectTableModelNames,
  isMatrixSlice
} from '../../selectors/query_selector';

const QuerySlicePane = () => {
  // Use an update counter to get the child components
  //  (i.e. the QueryFilterControls) to remount whenever
  //  the slice list has one removed.
  // If not, the component rendered state gets confused
  //  because of non-unique keys.
  const [updateCounter, setUpdateCounter] = useState(0);
  const {state, removeSlice} = useContext(QueryContext);
  const reduxState = useReduxState();

  function handleRemoveSlice(modelName: string, index: number) {
    removeSlice(modelName, index);
    setUpdateCounter(updateCounter + 1);
  }

  const matrixSlices = useMemo(() => {
    return Object.values(state.slices)
      .flat()
      .filter((slice) => isMatrixSlice(slice))
      .reduce((acc: {[key: string]: QueryFilter[]}, slice: QueryFilter) => {
        if (!acc.hasOwnProperty(slice.modelName)) acc[slice.modelName] = [];

        acc[slice.modelName].push(slice);

        return acc;
      }, {});
  }, [state.slices]);

  const attributesWithRootIdentifier = useMemo(() => {
    if (!state.rootIdentifier || !state.rootModel) return {};

    return {
      ...state.attributes,
      [state.rootModel]: [...(state.attributes[state.rootModel] || [])].concat([
        state.rootIdentifier
      ])
    };
  }, [state.attributes, state.rootModel, state.rootIdentifier]);

  const matrixModelNames = useMemo(() => {
    if (!state.rootModel) return [];

    return selectMatrixModelNames(
      selectModels(reduxState),
      attributesWithRootIdentifier
    );
  }, [reduxState, state.rootModel, attributesWithRootIdentifier]);

  const tableModelNames = useMemo(() => {
    if (!state.rootModel) return [];

    return selectTableModelNames(
      selectModels(reduxState),
      Object.keys(attributesWithRootIdentifier)
    );
  }, [reduxState, state.rootModel, attributesWithRootIdentifier]);

  const tableSlices = useMemo(() => {
    return Object.keys(state.slices)
      .filter((modelName) => tableModelNames.includes(modelName))
      .reduce((acc: {[key: string]: QueryFilter[]}, modelName) => {
        acc[modelName] = [...state.slices[modelName]];
        return acc;
      }, {});
  }, [state.slices, tableModelNames]);

  if (!state.rootModel) return null;

  return (
    <Card>
      <CardHeader
        title='Slice'
        subheader='table and matrix values out of the results'
      />
      <CardContent>
        {matrixModelNames.map((modelName: string, index: number) => (
          <QuerySliceModelAttributePane
            key={`matrix-${index}-${updateCounter}`}
            slices={matrixSlices[modelName]}
            modelName={modelName}
            isMatrix={true}
            removeSlice={handleRemoveSlice}
          />
        ))}
        {tableModelNames.map((modelName: string, index: number) => (
          <QuerySliceModelAttributePane
            key={`table-${index}-${updateCounter}`}
            slices={tableSlices[modelName]}
            modelName={modelName}
            isMatrix={false}
            removeSlice={handleRemoveSlice}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuerySlicePane;
