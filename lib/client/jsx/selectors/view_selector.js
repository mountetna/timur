import { createSelector } from 'reselect';

export const cloneView = (props)=>{
    let view = { ...props.view };

    return view;
};

export const getAllViews = (state)=>{
    if(state.views) return Object.values(state.views);
    return [];
};

export const isEmptyViews = createSelector(
    getAllViews,
    views => !views[0]
);

export const getEditableViews = createSelector(
    getAllViews,
    views => views.filter(view => view.is_editable)
);
