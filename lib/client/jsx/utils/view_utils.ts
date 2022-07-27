export type ViewPane = {
  items: ViewItem[];
  name: string;
  title: string;
  regex?: string;
  group?: string;
};

type ViewItem = {
  name: string;
  title: string;
  type: string;
  attribute_name: string;
};

export const reducePanes = (
  panes: ViewPane[],
  recordName: string
): {[key: string]: ViewPane[]} => {
  let panesByGroup = panes.reduce((groups, pane) => {
    let groupName = pane.group || 'default';
    groups[groupName] = groups[groupName] || [];
    groups[groupName].push(pane);
    return groups;
  }, {} as {[key: string]: ViewPane[]});

  // Now we compact the panes for each group, prioritizing
  //   the first one with a valid "regex" property that matches
  //   on the recordName.

  return panesByGroup;
};
