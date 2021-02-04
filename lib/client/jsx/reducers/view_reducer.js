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



const views = (oldViews = {}, action) => {
	switch (action.type) {
		case 'ADD_VIEW':
			return {
				...oldViews,
				[action.view_name]: action.view
			};
		case 'LOAD_VIEWS':
			return loadViews(oldViews, action.allViews);
		case 'UPDATE_VIEW':
			return { ...oldViews, [action.view.id]: action.view };
		case 'REMOVE_VIEW':
			let newViews = {...oldViews}
			delete newViews[action.id]
			return newViews
		default:
			return oldViews;
	}
};

export default views;


