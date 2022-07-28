import {recordMatchesRegex} from '../../../lib/client/jsx/utils/view_utils';

describe('recordMatchesRegex', () => {
  it('returns true if no regex provided', () => {
    expect(recordMatchesRegex('PROJ1-HS1-T1', undefined)).toEqual(true);
  });

  it('returns true if no recordName provided', () => {
    expect(recordMatchesRegex(undefined, '^PROJ1.*$')).toEqual(true);
  });

  it('correctly flags the record name', () => {
    expect(recordMatchesRegex('PROJ1-HS1-T1', '^PROJ1.*$')).toEqual(true);
    expect(recordMatchesRegex('PROJ1-HS1-T1', '.*SCG.*')).toEqual(false);
  });
});
