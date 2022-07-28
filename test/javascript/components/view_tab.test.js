import React from 'react';
import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewTab from '../../../lib/client/jsx/components/browser/view_tab';

describe('ViewTab', () => {
  it('renders without a regex', async () => {
    const {asFragment} = render(
      <ViewTab
        tab={{
          name: 'default',
          title: 'Default',
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
        }}
        record_name='PROJ1-HS1'
        model_name='Subject'
      />
    );

    await waitFor(() => screen.getByText('Pane1'));

    expect(screen.queryByText(/Pane1/)).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with a regex that matches the record_name', async () => {
    const {asFragment} = render(
      <ViewTab
        tab={{
          name: 'default',
          title: 'Default',
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
        }}
        record_name='PROJ1-HS1'
        model_name='Subject'
      />
    );

    await waitFor(() => screen.getByText('Pane1'));

    expect(screen.queryByText(/Pane1/)).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not render if regex false', () => {
    const {container} = render(
      <ViewTab
        tab={{
          name: 'default',
          title: 'Default',
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
          regex: '.*SCG.*'
        }}
        record_name='PROJ1-HS1'
        model_name='Subject'
      />
    );
    expect(container.innerHTML).toHaveLength(0);
  });
});
