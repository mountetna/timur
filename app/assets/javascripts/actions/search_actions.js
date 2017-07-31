export const cacheSearchPage = (page, model_name, record_names, clear_cache) => ({
  type: 'CACHE_SEARCH_PAGE',
  page, model_name, record_names, clear_cache
})

export const setSearchPage = (page) => ({
  type: 'SET_SEARCH_PAGE',
  page
})

export const setSearchPageSize = (page_size) => ({
  type: 'SET_SEARCH_PAGE_SIZE',
  page_size
})
