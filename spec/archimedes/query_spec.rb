require_relative '../../lib/models/archimedes'

describe Archimedes::Table do
  it 'should retrieve a table of data from Magma' do
    route_payload = JSON.generate([
      {:method=>"POST", :route=>"/query", :name=>"query", :params=>[]}
    ])
    stub_request(:options, Timur.instance.config(:magma)[:host]).
      to_return(status: 200, body: route_payload, headers: {'Content-Type': 'application/json'})

    # Need a RegEx for the URL match here because of the query params
    stub_request(:post, /https:\/\/magma.test\/query/)
      .with(
        body: {
          project_name:'timur',
          query: ['match', ['games', 'patron', 'name', '::equals', 'Zeus'], '::all', [['contestant', 'city'], ['event'], ['score']]]
        }.to_json
      ).to_return(
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          answer: [
            [ 1, [ 'athens', 'shot put', 4 ] ],
            [ 2, [ 'athens', 'pankration', 3 ] ],
            [ 3, [ 'sparta', 'shot put', 2 ] ],
            [ 4, [ 'sparta', 'pankration', 7 ] ],
            [ 5, [ 'rhodes', 'shot put', 1 ] ],
            [ 6, [ 'rhodes', 'pankration', 3 ] ],
          ],
          format: [
            'olympics::match#id',
            [
              'olympics::contestant#city',
              'olympics::match#event',
              'olympics::match#score'
            ]
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

  it 'should unpack a matrix column into separate columns' do
    route_payload = JSON.generate([
      {:method=>"POST", :route=>"/query", :name=>"query", :params=>[]}
    ])
    stub_request(:options, Timur.instance.config(:magma)[:host]).
      to_return(status: 200, body: route_payload, headers: {'Content-Type': 'application/json'})

    # Need a RegEx for the URL match here because of the query params
    stub_request(:post, /https:\/\/magma.test\/query?/)
      .with(
        body: {
          project_name:'timur',
          query: ['contestant', '::all', [ [ 'city' ], ['scores']]]
        }.to_json
      ).to_return(
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          answer: [
            [ 'Hercules', [ 'Thebes', [ 3, 3, 4 ] ] ],
            [ 'Jason', [ 'Iolcos', [ 3, 3, 3 ] ] ],
            [ 'Atalanta', [ 'Tripoli', [ 2, 2, 3 ] ] ],
            [ 'Hippolyta', [ 'Themiscyra', [ 4, 4, 3 ] ] ]
          ],
          format: [
            'olympics::contestant#name',
            [
              'olympics::contestant#city',
              [ 'olympics::contestant#scores', [ 'Athena', 'Nestor', 'Chiron' ] ]
            ]
          ]

        }.to_json
      )

    payload = run_script(
      %q!
@table = table(
  [
    'contestant',
    '::all',
    [
      city: [ 'city' ],
      scores: [ 'scores' ]
    ]
  ]
)
      !
    )
    expect(payload['table']).to be_a(Archimedes::Matrix)
    expect(payload['table'].row_names).to eq(['Hercules', 'Jason', 'Atalanta', 'Hippolyta'])
    expect(payload['table'].col_names).to eq(['city', 'Athena', 'Nestor', 'Chiron'])
    expect(payload['table'].rows.map(&:to_values)).to eq([
            [ 'Thebes', 3, 3, 4 ],
            [ 'Iolcos', 3, 3, 3 ],
            [ 'Tripoli', 2, 2, 3 ],
            [ 'Themiscyra', 4, 4, 3 ]
    ])
  end
end
