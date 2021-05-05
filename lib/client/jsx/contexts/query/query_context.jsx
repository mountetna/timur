import React, {useState, createContext, useEffect} from 'react';
import {useQueryAttributeStateManagement} from './query_attribute_state_management';

export const defaultContext = {
  state: {
    attributes: [],
    models: [],
    rootModel: null,
    filters: []
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

  function setModels(models) {
    setState({
      ...state,
      models: [...models]
    });
  }

  function setAttributes(attributes) {
    setState({
      ...state,
      attributes: [...attributes]
    });
  }

  function setFilters(filters) {
    setState({
      ...state,
      filters: [...filters]
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
        setModels,
        setAttributes,
        setFilters,
        setRootModel
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};
