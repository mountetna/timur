import {useCallback} from 'react';
import {useActionInvoker} from "etna-js/hooks/useActionInvoker";
import {requestDocuments} from "etna-js/actions/magma_actions";

// TODO: Unfold and replace the action with the hook.
export function useRequestDocuments() {
  const invoke = useActionInvoker();

  return useCallback((...args) => {
    return invoke(requestDocuments(...args));
  }, [invoke]);
}