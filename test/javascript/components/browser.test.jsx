import React from 'react';
import {Provider} from 'react-redux';
import {mount} from 'enzyme';
import {act} from 'react-dom/test-utils';
import {mockStore} from '../helpers';
import {stubUrl} from 'etna-js/spec/helpers';
import Browser from '../../../lib/client/jsx/components/browser/browser';
import {defaultView} from '../../../lib/client/jsx/selectors/tab_selector';

describe('Browser', () => {
  let store;

  const models = {
    monster: {template: require('../fixtures/template_monster.json')},
    labor: {template: require('../fixtures/template_labor.json')},
    project: {template: require('../fixtures/template_project.json')}
  };

  beforeEach(() => {
    global.CONFIG = {
      project_name: 'labors'
    };

    store = mockStore({
      magma: {models}
    });
  });

  // This test in practice doesn't test much because of the way we structure our app.
  // For one, the mockStore does not actually run any of the reducers, meaning that the initial setup
  // logic embedded in loading the browser page does not actually mutate the state without us
  // explicitly calling reducers ourselves in the test (breaking the meaning of the test).
  // Secondly, the logic depends on setLocation triggering changes in Router, meaning that the browser
  // component itself cannot be tested in isolation.
  // The solution could be to break out the entire loading workflow out of redux and put it into a context,
  // so that we can load the context locally in the state and not be dependent on the router or reducer objects
  // that won't get run in tests.
  it('renders', async () => {
    const initialStubs = [
      stubUrl({
        verb: 'get',
        url: Routes.get_view_path('labors', 'monster'),
        status: 200,
        response: {view: defaultView(models.monster.template)}
      })
    ];

    let browser = mount(
      <Provider store={store}>
        <Browser model_name='monster' record_name='joe' />
      </Provider>
    );

    await act(async () => {
      await Promise.all(initialStubs);
      // This is kind of silly, hope we can unpack these a bit.
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    await act(async () => {
      console.log(browser.debug());
      // browser.find('.test-bar-button-edit').simulate('click');
      await new Promise((resolve) => setTimeout(resolve, 10));
    });
  });
});
