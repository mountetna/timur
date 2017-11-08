require_relative '../app/models/archimedes'

describe Archimedes::Manifest do
  it 'runs a basic query' do
    value = 'this is a test'
    script = [ 'var1', "'#{value}'" ]
    manifest = Archimedes::Manifest.create(
      'xyzzy',
      'timur',
      script
    )

    payload = manifest.payload

    expect(payload['var1']).to eq(value)
  end
end

