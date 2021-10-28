import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import {mockStore} from '../../helpers';
import renderer from 'react-test-renderer';

import DateTimeAttribute from '../../../../lib/client/jsx/components/attributes/date_time_attribute';
import ShiftedDateTimeAttribute from '../../../../lib/client/jsx/components/attributes/shifted_date_time_attribute';

describe('ShiftedDateTimeAttribute', () => {
  let store;

  beforeEach(() => {});

  it('does not allow un-privileged users to edit', () => {
    store = mockStore({
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      },
      directory: {
        uploads: {}
      },
      user: {
        permissions: {
          labors: {
            privileged: false
          }
        }
      }
    });

    const component = mount(
      <Provider store={store}>
        <ShiftedDateTimeAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value='2000-01-01'
          mode='edit'
          attribute='gravatar'
          document='Timur'
          revised_value=''
        />
      </Provider>
    );

    const dateTimeAttribute = component.find(DateTimeAttribute);
    expect(dateTimeAttribute.exists()).toBeFalsy();

    const tree = renderer
      .create(
        <Provider store={store}>
          <ShiftedDateTimeAttribute
            model_name='conquests'
            record_name='Persia'
            template={null}
            value='2000-01-01'
            mode='edit'
            attribute='gravatar'
            document='Timur'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('allows privileged users to edit', () => {
    store = mockStore({
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      },
      directory: {
        uploads: {}
      },
      user: {
        permissions: {
          labors: {
            privileged: true
          }
        }
      }
    });

    const component = mount(
      <Provider store={store}>
        <ShiftedDateTimeAttribute
          model_name='conquests'
          record_name='Persia'
          template={null}
          value='2000-01-01'
          mode='edit'
          attribute='gravatar'
          document='Timur'
          revised_value=''
        />
      </Provider>
    );

    const dateTimeAttribute = component.find(DateTimeAttribute);
    expect(dateTimeAttribute.exists()).toBeTruthy();

    const tree = renderer
      .create(
        <Provider store={store}>
          <ShiftedDateTimeAttribute
            model_name='conquests'
            record_name='Persia'
            template={null}
            value='2000-01-01'
            mode='edit'
            attribute='gravatar'
            document='Timur'
            revised_value=''
          />
        </Provider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
