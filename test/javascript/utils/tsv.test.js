import { downloadTSV } from '../../../lib/client/jsx/utils/tsv';
import downloadjs from 'downloadjs';
jest.mock('downloadjs', ()=>(jest.fn()))

describe('downloadTSV', () => {
  it('triggers a download', () => {
    let data = [
      { labor: 'Nemean Lion', prize: 'hide' },
      { labor: 'Lernean Hydra', prize: 'arrows' }
    ];
    downloadTSV(
      data, ['labor', 'prize' ], 'labors'
    )

    let tsv = `"labor"\t"prize"\n${
      data.map(
        ({labor,prize})=> `"${labor}"\t"${prize}"`
      ).join('\n')
    }`;

    expect(downloadjs).toHaveBeenCalledWith(
      tsv,
      'labors.tsv',
      'text/tsv'
    );
  });
});
