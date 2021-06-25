import {
  injectValueAtPath,
  shouldInjectFilter
} from '../../../lib/client/jsx/utils/query_any_every_helpers';

describe('injectValueAtPath', () => {
  it('only adds ::any when it is already present', () => {
    let array = ['modelName'];
    injectValueAtPath(array, [1], ['new', 'tuple']);

    expect(array).toEqual(['modelName', ['new', 'tuple']]);
  });

  it('correctly injects and appends ::any', () => {
    let array = ['modelName', 'secondModel', ['thirdModel', '::any'], '::any'];
    injectValueAtPath(array, [2, 1], ['new', 'tuple']);

    expect(array).toEqual([
      'modelName',
      'secondModel',
      ['thirdModel', ['new', 'tuple'], '::any'],
      '::any'
    ]);
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
