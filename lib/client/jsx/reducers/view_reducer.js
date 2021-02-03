const loadViews = (state, allViews) => {
	return allViews ? {
		...state,
		...allViews.reduce(
			(allViews_by_id, view) => {
				view = ({
					...view,
					name: view['model_name'],
					document: JSON.stringify(view['document'], null, '\t')});
				allViews_by_id[view.id] = view;
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
			return { ...old_views, [action.view.id]: action.view };
		default:
			return old_views;
	}
};

export default views;


