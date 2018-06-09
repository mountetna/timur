require_relative '../lib/models/archimedes'

describe ArchimedesController do
  include Rack::Test::Methods

  def app
    OUTER_APP
  end

  it 'runs a consignment script' do
    script = "@test = 'blah'"
    md5sum = Digest::MD5.hexdigest(script).to_sym

    auth_header(:viewer)
    json_post('labors/consignment', queries: [ script ])

    expect(last_response.status).to eq(200)
    expect(json_body).to eq(md5sum => { test: 'blah' })
  end

  it 'runs a consignment record' do
    viewer = create(:user, :viewer)
    manifest = create(:manifest, :private, data: "@test = 'blah'", user: viewer)
    md5sum = Digest::MD5.hexdigest(manifest.data).to_sym

    auth_header(:viewer)
    json_post('labors/consignment', manifest_ids: [ manifest.id ])

    expect(last_response.status).to eq(200)
    expect(json_body).to eq(md5sum => { test: 'blah' })
  end
end

describe Archimedes::Manifest do
  it 'runs a basic query' do
    value = 'this is a test'

    payload = run_script(
      var1: "'#{value}'"
    )

    expect(payload['var1']).to eq(value)
  end

  it 'raises errors for broken syntax' do
    expect {
      run_script(
        var1: "invalid syntax"
      )
    }.to raise_error(Archimedes::LanguageError)
  end

  it 'supports math operations' do
    payload = run_script(
      mul: "4 * 4",
      div: "4 / 4",
      add: "4 + 4",
      exp: "4 ^ 4",
      sub: "4 - 4",
      ternary: "4 == 4 ? 4 : -4"
    )
    expect(payload['mul']).to eq(16)
    expect(payload['div']).to eq(1)
    expect(payload['add']).to eq(8)
    expect(payload['exp']).to eq(256)
    expect(payload['sub']).to eq(0)
    expect(payload['ternary']).to eq(4)
  end

  it 'supports lists' do
    payload = run_script(
      var1: "[ ant: 'a', bear: 'b', cat: 'c' ]"
    )
    vector = payload['var1']
    expect(vector).to be_a(Archimedes::Vector)
    expect(vector.to_labels).to eq(['ant', 'bear', 'cat'])
    expect(vector.to_values).to eq(['a', 'b', 'c'])
  end

  it 'supports template macros' do
    payload = run_script(
      template: "{%1 * %2}",
      value: "@template('4', '4')"
    )

    expect(payload['value']).to eq(16)
  end

  it 'supports infix notation' do
    payload = run_script(
      calc: "(4 + 4) * 4 + 4"
    )

    expect(payload['calc']).to eq(36)
  end

  it 'supports indexing into vectors' do
    payload = run_script(
      list: "[ ant: 'a', bear: 'b', cat: 'c' ]",
      int: "@list[0]",
      let: "@list['bear']"
    )
    expect(payload['int']).to eq('a')
    expect(payload['let']).to eq('b')
  end

  it 'supports comparisons' do
    payload = run_script(
      gt: "4 > 0",
      gte: "4 >= 9",
      lt: "4 < 10",
      lte: "4 <= 15",
      eq: "4 == 15"
    )

    expect(payload['gt']).to be(true)
    expect(payload['gte']).to be(false)
    expect(payload['lt']).to be(true)
    expect(payload['lte']).to be(true)
    expect(payload['eq']).to be(false)
  end
end
