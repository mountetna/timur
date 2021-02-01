const loadViews = (state, allViews) => {
	return allViews ? {
		...state,
		...allViews.reduce(
			(allViews_by_id, view) => {
				if (!view.name) view.name = view.model_name;
				allViews_by_id[view.model_name] = view;
				return allViews_by_id;
			}, {}
		)
	} : state;
};

const views = (old_views = {}, action) => {
	switch (action.type) {
		case 'ADD_VIEW':
			return {
				...old_views,
				[action.view_name]: action.view
			};
		case 'LOAD_VIEWS':
			return loadViews(old_views, action.allViews);
		case 'UPDATE_VIEW':
			return { ...old_views, [action.view.viewKey]: action.view };
		default:
			return old_views;
	}
};

export default views;


