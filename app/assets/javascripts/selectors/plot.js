export const allPlots = (state) => Object.keys(state.plotsMap).map(key => state.plotsMap[key]);

export const plotsByIds = (state, ids) => ids.map(id => state.plotsMap[id]);

export const plotById = (state, id) => state.plotsMap[id];