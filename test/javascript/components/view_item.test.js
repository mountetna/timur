import React from 'react';
import {render, screen, waitFor, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ViewItem from '../../../lib/client/jsx/components/browser/view_item';

describe('ViewItem', () => {
  it('renders without a regex', async () => {
    const {asFragment} = render(
      <ViewItem
        item={{
          name: 'attribute1',
          type: 'markdown',
          text: 'This is a test'
        }}
        record_name='PROJ1-HS1'
      />
    );

    await waitFor(() => screen.getByText('This is a test'));

    expect(screen.queryByText(/This is a test/)).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with a regex that matches the record_name', async () => {
    const {asFragment} = render(
      <ViewItem
        item={{
          name: 'attribute1',
          type: 'markdown',
          text: 'This is a test',
          regex: 'PROJ1'
        }}
        record_name='PROJ1-HS1'
      />
    );

    await waitFor(() => screen.getByText('This is a test'));

    expect(screen.queryByText(/This is a test/)).toBeTruthy();
    expect(asFragment()).toMatchSnapshot();
  });

  it('does not render if regex false', () => {
    const {container} = render(
      <ViewItem
        item={{
          name: 'attribute1',
          type: 'markdown',
          text: 'This is a test',
          regex: '.*SCG.*'
        }}
        record_name='PROJ1-HS1'
      />
    );
    expect(container.innerHTML).toHaveLength(0);
  });
});
