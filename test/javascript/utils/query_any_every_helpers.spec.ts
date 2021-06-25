import {
  injectValueAtPath,
  shouldInjectFilter
} from '../../../lib/client/jsx/utils/query_any_every_helpers';

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

describe('shouldInjectFilter', () => {
  it('returns true for tuples at the root level', () => {
    expect(
      shouldInjectFilter(
        {
          modelName: 'test',
          attributeName: 'foo',
          operator: '::equals',
          operand: 'bar'
        },
        ['test', '::any']
      )
    ).toEqual(true);
  });

  it('returns true for flat ::anys at root level', () => {
    expect(
      shouldInjectFilter(
        {
          modelName: 'singleton',
          attributeName: 'foo',
          operator: '::equals',
          operand: 'bar'
        },
        ['test', 'singleton', '::any']
      )
    ).toEqual(true);
  });

  it('returns true for nested paths', () => {
    expect(
      shouldInjectFilter(
        {
          modelName: 'test',
          attributeName: 'foo',
          operator: '::equals',
          operand: 'bar'
        },
        ['something', ['where', ['I', ['test', '::any']]]]
      )
    ).toEqual(true);
  });

  it('returns false for paths without ::any', () => {
    expect(
      shouldInjectFilter(
        {
          modelName: 'test',
          attributeName: 'foo',
          operator: '::equals',
          operand: 'bar'
        },
        ['something']
      )
    ).toEqual(false);
  });

  it('returns false for filters without matching models', () => {
    expect(
      shouldInjectFilter(
        {
          modelName: 'test',
          attributeName: 'foo',
          operator: '::equals',
          operand: 'bar'
        },
        ['anotherModel', '::any']
      )
    ).toEqual(false);
  });
});
