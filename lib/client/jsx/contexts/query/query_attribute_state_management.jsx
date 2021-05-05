import React, {useState, createContext, useEffect} from 'react';

export function useQueryAttributeStateManagement(state, setAttributes) {
  const {models, attributes} = state;

  useEffect(() => {
    if (models && attributes) {
      // Remove any attributes not related to the selected models.
      setAttributes(attributes.filter(({model}) => models.include(model)));
    }
  }, [models]);
}
