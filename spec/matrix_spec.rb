require_relative '../lib/models/archimedes'

describe Archimedes::Matrix do
  it "should create a matrix with bind('rows/cols',M,M,V,V)" do
    payload = run_script(
     "@matrix1 = bind('rows', [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8] ])
      @matrix2 = bind('cols', [ ant: [ 1, 2, 3, 4 ], bear: [ 5, 6, 7, 8] ])
      @matrix3 = bind('cols', [ @matrix2, cat: [ 9, 10, 11, 12 ] ])"
    )
    expect([1,2,3].map{|n| payload["matrix#{n}"]}).to all(be_a(Archimedes::Matrix))
    expect(payload['matrix1'].rows.map(&:to_values)).to eq( [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8] ])
    expect(payload['matrix2'].rows.map(&:to_values)).to eq([
      [ 1, 5],
      [ 2, 6 ],
      [ 3, 7 ],
      [ 4, 8 ]
    ])
    expect(payload['matrix3'].rows.map(&:to_values)).to eq([
      [ 1, 5, 9],
      [ 2, 6, 10 ],
      [ 3, 7, 11 ],
      [ 4, 8, 12 ]
    ])
    expect(payload['matrix3'].col_names).to eq(['ant', 'bear', 'cat'])
  end

  it "should be able to multiply M * n" do
    payload = run_script(
     "@matrix1 = bind('rows', [ [ 1, 2, 3 ], [ 4, 5, 6 ] ])
      @matrix2 = @matrix1 * 4
      @matrix3 = @matrix1 / 4
      @matrix4 = @matrix1 + 4
      @matrix5 = @matrix1 - 4"
    )
    expect(payload['matrix2'].rows.map(&:to_values)).to eq(
      [ [ 4, 8, 12 ], [ 16, 20, 24 ] ]
    )
    expect(payload['matrix3'].rows.map(&:to_values)).to eq(
      [[0.25, 0.5, 0.75], [1.0, 1.25, 1.5]]
    )
    expect(payload['matrix4'].rows.map(&:to_values)).to eq(
      [[5, 6, 7], [8, 9, 10]]
    )
    expect(payload['matrix5'].rows.map(&:to_values)).to eq(
      [[-3, -2, -1], [0, 1, 2]]
    )
  end

  it "should be able to multiply M1 * M2 if they are the same sizer" do
    payload = run_script(
     "@matrix1 = bind('rows', [ [ 1, 2, 3 ], [ 4, 5, 6 ] ])
      @matrix2 = bind('rows', [ [ 1, 2, 3 ], [ 4, 5, 6 ] ])
      @matrix3 = @matrix2 * @matrix1"
    )
    expect(payload['matrix3'].rows.map(&:to_values)).to eq(
      [[1, 4, 9], [16, 25, 36]]
    )
  end

  it "should be able to divide M / V and return a row-wise division (etc.) if V is the right size" do
    payload = run_script(
     "@matrix = bind('rows', [ [ 1, 2, 3 ], [ 4, 5, 6 ] ])
      @vector = [ 1, 2, 3 ]
      @matrix2 = @matrix / @vector"
    )
    expect(payload['matrix2'].rows.map(&:to_values)).to eq(
      [[1, 1, 1], [4, 2.5, 2]]
    )
  end

  it "should be able to divide M / column(V) and return a col-wise division (etc.) if V is the right size" do
    payload = run_script(
     "@matrix = bind('rows', [ [ 1, 2, 3 ], [ 4, 5, 6 ] ])
      @vector = [ 1, 2 ]
      @matrix2 = @matrix / column(@vector)"
    )
    expect(payload['matrix2'].rows.map(&:to_values)).to eq(
      [[1, 2, 3], [2, 2.5, 3]]
    )
  end

  it "should be able to subset a matrix using M[ rows, cols ]" do
    payload = run_script(
     "@matrix = bind('cols', [ hat_size: [ 1, 2, 3 ], shoe_size: [ 4, 5, 6 ] ])
      @matrix2 = @matrix[ which(@matrix$shoe_size != 4), [ 0, 1 ]  ]
      @matrix3 = @matrix[ order(@matrix$shoe_size,'desc'),  ]"
    )
    expect(payload['matrix2'].rows.map(&:to_values)).to eq(
      [[2, 5], [3, 6]]
    )
    expect(payload['matrix3'].rows.map(&:to_values)).to eq(
      [ [3, 6], [2, 5], [1, 4] ]
    )
  end

  it "should be spreadable" do
    payload = run_script(
     "@matrix = bind('cols', [
        team: [ 'lacedaemonians', 'lacedaemonians', 'lacedaemonians',
                'athenians', 'athenians', 'athenians',
                'thracians', 'thracians', 'thracians'
              ], 
        event: [ 
        'shot put', 'long jump', 'pankration',
        'shot put', 'long jump', 'pankration',
        'shot put', 'long jump', 'pankration'
        ],
        score: [ 1, 3, 4, 2, 1, 3, 2, 3, 9 ] ])
      @matrix2 =  spread(@matrix)"
    )
    expect(payload['matrix2'].dim).to eq([3,3])
    expect(payload['matrix2'].rows.map(&:to_values)).to eq(
      [[1, 3, 4], [2, 1, 3], [2, 3, 9]]
    )
    expect(payload['matrix2'].row_names).to eq(['lacedaemonians', 'athenians', 'thracians'])
    expect(payload['matrix2'].col_names).to eq(['shot put', 'long jump', 'pankration'])
  end

  it "computes rowsums and colsums" do
    payload = run_script(
     "@matrix = bind('cols', [
          [ 1, 2, 3 ], [ 4, 5, 6 ], [ 7, 8, 9 ], [ 10, 11, 12 ]
        ])
      @rowsum = rowsums(@matrix)
      @colsum = colsums(@matrix)"
    )
    expect(payload['rowsum'].to_values).to eq([22,26,30])
    expect(payload['colsum'].to_values).to eq([6,15,24,33])
  end
end
