const pages = (pages, action) => {
  if (!pages) pages = {}
  switch (action.type) {
    case 'CACHE_SEARCH_PAGE':
      return {
        ...!action.clear_cache && pages,
        [action.page]: {
          record_names: action.record_names,
        }
      }
  }
}

const searchReducer = (search, action) => {
  if (!search) search = { pages: {} }
  switch (action.type) {
    case 'SET_SEARCH_PAGE_SIZE':
      return {
        ...search,
        page_size: action.page_size
      }
    case 'SET_SEARCH_PAGE':
      return {
        ...search,
        current_page: action.page
      }
    case 'CACHE_SEARCH_PAGE':
      return {
        ...search,
        model_name: action.model_name,
        pages: pages(search.pages, action)
      }
    default:
      return search
  }
}

export default searchReducer
