import React, {useEffect, useMemo, useState} from 'react';
import {QueryState, defaultQueryParams} from './query_context';
import {QueryColumn, QueryFilter} from './query_types';

export default function useUriQueryParams(
  state: QueryState,
  patchState: (updatedState: QueryState) => void
) {
  const search = window.location.search;
  const pathname = window.location.pathname;
  const queryKeys = Object.keys(defaultQueryParams);

  // Update the search params to reflect current state
  useEffect(() => {
    let searchParams = new URLSearchParams(search);
    queryKeys.forEach((key: string) => {
      if (key in state) {
        searchParams.set(key, JSON.stringify((state as any)[key]));
      }
    });

    if (search !== searchParams.toString()) {
      history.pushState({}, '', `${pathname}?${searchParams.toString()}`);
    }
  }, [state, search, queryKeys, pathname]);

  // Set current state to reflect query params only on component load
  useEffect(() => {
    let searchParams = new URLSearchParams(search);
    let clone: any = {...state};
    delete clone.graph;

    let serializedState =
      '?' +
      Object.entries(clone)
        .map(([key, value]) => {
          return `${key}=${encodeURIComponent(JSON.stringify(value))}`;
        })
        .join('&');

    if (serializedState === search) return;

    patchState({
      ...state,
      columns: JSON.parse(searchParams.get('columns') || '[]'),
      recordFilters: JSON.parse(searchParams.get('recordFilters') || '[]'),
      orRecordFilterIndices: JSON.parse(
        searchParams.get('orRecordFilterIndices') || '[]'
      ),
      rootModel: JSON.parse(searchParams.get('rootModel') || '""'),
      rootIdentifier: JSON.parse(searchParams.get('rootIdentifier') || '{}')
    });
  }, []);
}
