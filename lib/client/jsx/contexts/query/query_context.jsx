import React, {useState, createContext, useEffect} from 'react';
import {useQueryAttributeStateManagement} from './query_attribute_state_management';

export const defaultContext = {
  state: {
    attributes: {},
    rootModel: null,
    filters: {}
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
    console.log('in setAttributes', attributes);
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
        setAttributes,
        setFilters,
        setRootModel
      }}
    >
      {props.children}
    </QueryContext.Provider>
  );
};
