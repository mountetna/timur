import {filePathComponents} from '../../../lib/client/jsx/selectors/magma';

describe('filePathComponents', () => {
  it('correctly parses an upload URL', () => {
    let {hostname, project_name, bucket_name, file_name} = filePathComponents(
      'https://metis.test/labors/upload/files/trophies/lion-skin.jpg?X-Etna-Signature=foo'
    );

    expect(hostname).toEqual('metis.test');
    expect(project_name).toEqual('labors');
    expect(bucket_name).toEqual('files');
    expect(file_name).toEqual('trophies/lion-skin.jpg');
  });

  it('correctly parses a download URL', () => {
    let {hostname, project_name, bucket_name, file_name} = filePathComponents(
      'https://metis.test/labors/download/files/trophies/hydra-scale.jpg?X-Etna-Signature=foo'
    );

    expect(hostname).toEqual('metis.test');
    expect(project_name).toEqual('labors');
    expect(bucket_name).toEqual('files');
    expect(file_name).toEqual('trophies/hydra-scale.jpg');
  });
});
