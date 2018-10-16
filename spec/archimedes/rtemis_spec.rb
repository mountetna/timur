require_relative '../../lib/models/archimedes'

describe Archimedes::RtemisFunctions do
  it 'passes requests to rtemis' do
    col_names = ['a', 'b', 'c']
    row_names = ['x', 'y']
    rows = [
      Archimedes::Vector.new(col_names.zip( [ 1.0, 2.0, 3.0 ] )),
      Archimedes::Vector.new(col_names.zip( [ 4.0, 5.0, 6.0 ] ))
    ]

    # our input and our output
    matrix = Archimedes::Matrix.new(row_names, col_names, rows)
    transposed_matrix = Archimedes::Matrix.new(
      col_names, row_names,
      [ matrix['a'], matrix['b'], matrix['c'] ]
    )

    # the https request that should be made to rtemis and its response
    stub_request(:post, "https://rtemis.test/")
      .with(
        body: { func:"transpose", args: [ matrix.payload ] }.to_json,
        headers: { 'Content-Type'=>'application/json' }
      ).to_return(
        status: 200, body: {
          output: transposed_matrix.payload
        }.to_json
      )

    # now we run a script that calls transpose()
    payload = run_script(
     "@mat = bind('rows', [ x: [ a: 1, b: 2, c: 3 ], y: [ 4, 5, 6 ] ])
      @tmat = transpose(@mat)"
    )

    # it returns the expected matrix
    expect(payload['tmat']).to be_a(Archimedes::Matrix)
    expect(payload['tmat'].row_names).to eq(col_names)
    expect(payload['tmat'].col_names).to eq(row_names)
  end
end
