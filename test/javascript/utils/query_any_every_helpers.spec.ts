import {injectValueAtPath} from '../../../lib/client/jsx/utils/query_any_every_helpers';

describe('injectValueAtPath', () => {
  it('correctly injects and appends ::any', () => {
    let array = ['modelName', 'secondModel', ['thirdModel', '::any'], '::any'];
    let injected = injectValueAtPath(array, [2, 1], ['new', 'tuple']);

    expect(array).toEqual([
      'modelName',
      'secondModel',
      ['thirdModel', ['new', 'tuple'], '::any'],
      '::any'
    ]);
    expect(injected).toEqual(true);
  });

  it('correctly injects and appends ::every', () => {
    let array = [
      'modelName',
      'secondModel',
      ['thirdModel', '::every'],
      '::every'
    ];
    let injected = injectValueAtPath(array, [2, 1], ['new', 'tuple']);

    expect(array).toEqual([
      'modelName',
      'secondModel',
      ['thirdModel', ['new', 'tuple'], '::every'],
      '::every'
    ]);
    expect(injected).toEqual(true);
  });

  it('unpacks the new value (instead of injecting) if no ::any being replaced', () => {
    let array = ['modelName', ['something', ['nested']]];
    let injected = injectValueAtPath(array, [1, 1, 1], ['new', 'tuple']);

    expect(array).toEqual([
      'modelName',
      ['something', ['nested', 'new', 'tuple']]
    ]);
    expect(injected).toEqual(false);
  });
});
