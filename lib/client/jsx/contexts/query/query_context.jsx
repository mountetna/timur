import React, {useState, createContext, useEffect} from 'react';
import {useQueryAttributeStateManagement} from './query_attribute_state_management';

export const defaultContext = {
  state: {
    attributes: {},
    rootModel: null,
    recordFilters: [],
    valueFilters: []
  }
};

export const QueryContext = createContext(defaultContext);

export const QueryProvider = (props) => {
  const [state, setState] = useState({});

  useEffect(() => {
    setState({
      ...(props.state || defaultContext.state)
    });
  }, []);

  function setAttributes(attributes, model_name) {
    // Remove a model if no attributes
    let updatedAttributes = {...state.attributes};

    if (attributes.length > 0) {
      updatedAttributes[model_name] = attributes;
    } else {
      delete updatedAttributes[model_name];
    }

    setState({
      ...state,
      attributes: updatedAttributes
    });
  }

  function addRecordFilter(recordFilter) {
    setState({
      ...state,
      recordFilters: [...state.recordFilters].concat([recordFilter])
    });
  }

  function removeRecordFilter(filterIndex) {
    let updatedRecordFilters = [...state.recordFilters];
    updatedRecordFilters.splice(filterIndex, 1);
    setState({
      ...state,
      recordFilters: updatedRecordFilters
    });
  }

  function addValueFilter(valueFilter) {
    setState({
      ...state,
      valueFilters: [...state.valueFilters].concat([valueFilter])
    });
  }

  function removeValueFilter(filterIndex) {
    let updatedValueFilters = [...state.valueFilters];
    updatedValueFilters.splice(filterIndex, 1);
    setState({
      ...state,
      valueFilters: updatedValueFilters
    });
  }

  function setRootModel(rootModel) {
    setState({
      ...state,
      rootModel
    });
  }

  useQueryAttributeStateManagement(state, setAttributes);

  return (
    <QueryContext.Provider
      value={{
        state,
        setAttributes,
        addRecordFilter,
        removeRecordFilter,
        addValueFilter,
        removeValueFilter,
        setRootModel
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};
