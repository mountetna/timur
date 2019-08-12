import React from 'react';
import { shallow, mount } from 'enzyme';
import TimurUI from '../../../lib/client/jsx/timur_ui';
import { mockStore } from '../helpers';

jest.mock('../../../lib/client/jsx/components/browser/browser',
  () => 'mock-browser'
);
jest.mock('../../../lib/client/jsx/components/timur_nav',
  () => function() {
    return <div className='timur-nav'/>;
  }
);
jest.mock('../../../lib/client/jsx/components/messages',
  () => function() {
    return <div className='messages'/>;
  }
);

describe('TimurUI', () => {
  it('displays the component for a matching route', () => {
    const store=mockStore({
      location: {
        path: '/labors/browse/monster/Nemean Lion'
      }
    });

    let component = mount(<TimurUI store={store}/>);

    let p = component.find('mock-browser').first();
    expect(p.prop('project_name')).toEqual('labors');
    expect(p.prop('model_name')).toEqual('monster');
    expect(p.prop('record_name')).toEqual('Nemean Lion');
  });

  it('can deal with encoded slashes params', () => {
    let component = mount(<TimurUI store={
      mockStore({
        location: {
          path: '/labors/browse/monster/Nemean Lion%2FLioness'
        }
      })
    }/>);

    let p = component.find('mock-browser').first();
    expect(p.prop('record_name')).toEqual('Nemean Lion/Lioness');
  });

  it('matches hash arguments in the route', () => {
    const store=mockStore({
      location: {
        path: '/labors/browse/monster/Nemean Lion',
        hash: '#images'
      }
    });

    let component = mount(
      <TimurUI store={store}/>
    );

    let p = component.find('mock-browser').first();
    expect(p.prop('project_name')).toEqual('labors');
    expect(p.prop('model_name')).toEqual('monster');
    expect(p.prop('record_name')).toEqual('Nemean Lion');
    expect(p.prop('tab_name')).toEqual('images');
  });

  it('shows a message for an unknown route', () => {
    const store=mockStore({
      location: {
        path: '/silly/route/nomatch'
      }
    });

    let component = mount(
      <TimurUI store={store}/>
    );
    expect(store.getActions()).toEqual([
      {
        messages: [ "### You have lost your way: Path Invalid." ],
        type: "SHOW_MESSAGES"
      }
    ]);
  });
})
