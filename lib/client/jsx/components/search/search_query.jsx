import React, {useState} from 'react';
import {connect} from 'react-redux';
import SelectInput from 'etna-js/components/inputs/select_input';
import Toggle from 'etna-js/components/inputs/toggle';
import {selectModelNames} from "etna-js/selectors/magma";
import {useReduxState} from 'etna-js/hooks/useReduxState';
import {
  selectSearchFilterString,
  selectSearchShowDisconnected,
  selectSortedAttributeNames,
  selectSearchOutputPredicate,
  selectSearchExpandMatrices
} from "../../selectors/search";
import {requestTSV} from "etna-js/actions/magma_actions";
import {
  setFilterString, setSearchAttributeNames
} from "../../actions/search_actions";
import QueryBuilder from "./query_builder";

const TableSelect = ({model_names, selectedModel, onSelectTableChange}) =>
  <div className='table-select'>
    <span className='label'>Search table</span>
    <SelectInput
      name='model'
      values={model_names}
      value={selectedModel}
      onChange={onSelectTableChange}
      showNone='enabled'
    />
  </div>;

const PageSelect = ({pageSize, setPageSize}) =>
  <div className='page-select'>
    <span className='label'>Page size</span>
    <SelectInput
      values={[10, 25, 50, 200]}
      defaultValue={pageSize}
      onChange={setPageSize}
      showNone='disabled'
    />
  </div>;

const DisabledButton = ({id,disabled,label,onClick}) =>
  <input
    id={id}
    type='button'
    className={ disabled ? 'button disabled' : 'button' }
    value={label}
    disabled={disabled}
    onClick={onClick}
  />;

export function SearchQuery({
  selectedModel, setFilterString, loading, requestTSV, model_names, onSelectTableChange,
  pageSize, setPageSize, setPage, attribute_names, display_attributes, filter_string,
  output_predicate, expand_matrices
}) {
  const buttonDisabled = !selectedModel || loading;
  const [showAdvanced, setShowAdvanced] = useState(false);

  const show_disconnected = useReduxState(state => selectSearchShowDisconnected(state));

  const advancedSearch = <div className='advanced-search'>
    <input
      type='text'
      className='filter'
      placeholder='Filter query'
      defaultValue={filter_string}
      onBlur={(e) => setFilterString(e.target.value)}
    />
  </div>;

  return (
    <div className='query'>
      <TableSelect { ...{ selectedModel, model_names, onSelectTableChange } }/>
      <PageSelect { ...{pageSize, setPageSize} }/>

      <div className='query-options'>
      { selectedModel && <div className='query-mode'>
          <Toggle
            label={ showAdvanced ? 'Raw' : 'Basic' }
            selected={ showAdvanced }
            onClick={() => setShowAdvanced(!showAdvanced)}/>
        </div>
      }
      { selectedModel &&
          (showAdvanced ? advancedSearch : <QueryBuilder setShowAdvanced={setShowAdvanced} selectedModel={selectedModel} display_attributes={display_attributes} />)
      }
      </div>
      <DisabledButton
        id='search-pg-search-btn'
        label='Search'
        disabled={buttonDisabled}
        onClick={() => setPage(0, true)}
      />
      <DisabledButton
        id='search-pg-tsv-btn'
        label={'\u21af TSV'}
        disabled={buttonDisabled}
        onClick={() =>
          requestTSV({
            model_name: selectedModel,
            filter: filter_string,
            attribute_names,
            show_disconnected,
            output_predicate: output_predicate,
            expand_matrices: expand_matrices
          })
        }
      />
    </div>
  );
}


export default connect(
  (state) => ({
    model_names: selectModelNames(state),
    attribute_names: selectSortedAttributeNames(state),
    filter_string: selectSearchFilterString(state),
    output_predicate: selectSearchOutputPredicate(state),
    expand_matrices: selectSearchExpandMatrices(state)
  }),
  {
    setSearchAttributeNames,
    setFilterString,
    requestTSV,
  }
)(SearchQuery);

