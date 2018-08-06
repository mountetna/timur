require_relative '../lib/models/archimedes'

describe Archimedes::Table do
  it 'should retrieve a table of data from Magma' do
    stub_request(:post, Timur.instance.config(:magma)[:host]+'/query')
      .with(
        body: {
          project_name:'timur', 
          query: ['match', ['games', 'patron', 'name', '::equals', 'Zeus'], '::all', [['contestant', 'city'], ['event'], ['score']]]
        }.to_json
      ).to_return(
        body: {
          answer: [ 
            [ 1, [ 'athens', 'shot put', 4 ] ],
            [ 2, [ 'athens', 'pankration', 3 ] ],
            [ 3, [ 'sparta', 'shot put', 2 ] ],
            [ 4, [ 'sparta', 'pankration', 7 ] ],
            [ 5, [ 'rhodes', 'shot put', 1 ] ],
            [ 6, [ 'rhodes', 'pankration', 3 ] ],
          ]
        }.to_json
      )

    payload = run_script(
      %q!
@table = table(
  [
    'match',
    [ 'games', 'patron', 'name', '::equals', 'Zeus' ],
    '::all',
    [
      city: [ 'contestant', 'city' ],
      event: [ 'event' ],
      score: [ 'score' ]
    ]
  ],
  [ order: 'event' ]
)
      !
    )
    expect(payload['table']).to be_a(Archimedes::Matrix)
    expect(payload['table'].rows.map(&:to_values)).to eq([
      ["athens", "pankration", 3],
      ["sparta", "pankration", 7],
      ["rhodes", "pankration", 3],
      ["athens", "shot put", 4],
      ["sparta", "shot put", 2],
      ["rhodes", "shot put", 1]
    ])
  end
end
