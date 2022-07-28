import React from 'react';
import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewTabBar from '../../../lib/client/jsx/components/browser/view_tab_bar';

describe('ViewTabBar', () => {
  it('renders without a regex', async () => {
    const {asFragment} = render(
      <ViewTabBar
        view={{
          tabs: [
            {
              name: 'overview',
              title: 'Overview',
              description: null,
              panes: [
                {
                  name: 'pane1',
                  items: [
                    {
                      name: 'attribute1',
                      type: 'markdown',
                      text: 'This is a test'
                    }
                  ],
                  title: 'Pane1'
                }
              ]
            },
            {
              name: 'sequencing',
              title: 'Sequencing',
              description: null,
              panes: [
                {
                  name: 'pane1',
                  items: [
                    {
                      name: 'attribute1',
                      type: 'markdown',
                      text: 'This is a test 2'
                    }
                  ],
                  title: 'Pane1'
                }
              ]
            }
          ]
        }}
        recordName='PROJ1-HS1'
      />
    );

    await waitFor(() => screen.getByText('Overview'));

    expect(screen.queryByText(/Overview/)).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with a regex that matches the record_name', async () => {
    const {asFragment} = render(
      <ViewTabBar
        view={{
          tabs: [
            {
              name: 'overview',
              title: 'Overview',
              description: null,
              panes: [
                {
                  name: 'pane1',
                  items: [
                    {
                      name: 'attribute1',
                      type: 'markdown',
                      text: 'This is a test'
                    }
                  ],
                  title: 'Pane1'
                }
              ],
              regex: 'PROJ1'
            },
            {
              name: 'sequencing',
              title: 'Sequencing',
              description: null,
              panes: [
                {
                  name: 'pane1',
                  items: [
                    {
                      name: 'attribute1',
                      type: 'markdown',
                      text: 'This is a test 2'
                    }
                  ],
                  title: 'Pane1'
                }
              ]
            }
          ]
        }}
        recordName='PROJ1-HS1'
      />
    );

    await waitFor(() => screen.getByText('Overview'));

    expect(screen.queryByText(/Overview/)).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not render if regex false', () => {
    const {container} = render(
      <ViewTabBar
        view={{
          tabs: [
            {
              name: 'overview',
              title: 'Overview',
              description: null,
              panes: [
                {
                  name: 'pane1',
                  items: [
                    {
                      name: 'attribute1',
                      type: 'markdown',
                      text: 'This is a test'
                    }
                  ],
                  title: 'Pane1'
                }
              ],
              regex: 'SCG'
            },
            {
              name: 'sequencing',
              title: 'Sequencing',
              description: null,
              panes: [
                {
                  name: 'pane1',
                  items: [
                    {
                      name: 'attribute1',
                      type: 'markdown',
                      text: 'This is a test 2'
                    }
                  ],
                  title: 'Pane1'
                }
              ]
            }
          ]
        }}
        recordName='PROJ1-HS1'
      />
    );
    expect(container.innerHTML).toEqual('<div style="display: none;"></div>');
  });
});
