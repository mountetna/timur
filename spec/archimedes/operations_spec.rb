require_relative '../../lib/models/archimedes'

describe 'Archimedes Operators' do
  it 'allows true, false and nil keywords' do
    payload = run_script(
     '@t = true
      @f = false
      @n = nil'
    )
    expect(payload['t']).to eq(true)
    expect(payload['f']).to eq(false)
    expect(payload['n']).to eq(nil)
  end

  it 'compares two numbers' do
    payload = run_script(
     '@vec = 10 > 2'
    )
    expect(payload['vec']).to eq(true)
  end

  it 'compares two vectors' do
    payload = run_script(
     '@vec1 = [ 1, 2, 3 ]
      @vec2 = [ 1, 4, 3 ]
      @same = @vec1 == @vec2'
    )
    expect(payload['same']).to eq([ true, false, true ])
  end

  it 'compares a vector and a number' do
    payload = run_script(
     '@vec1 = [ 1, 2, 3 ]
      @gte = @vec1 >= 2'
    )
    expect(payload['gte']).to eq([ false, true, true ])
  end

  it 'compares to nil' do
    payload = run_script(
     '@vec1 = [ 1, nil, 3 ]
      @n1 = @vec1 == nil
      @n2 = @vec1 != nil'
    )
    expect(payload['n1']).to eq([ false, true, false ])
    expect(payload['n2']).to eq([ true, false, true ])
  end

  it 'supports boolean comparisons' do
    payload = run_script(
      '@or1 = true || false
       @or2 = false || false
       @or3 = false || true
       @or4 = true || true
       @and1 = true && false
       @and2 = false && false
       @and3 = false && true
       @and4 = true && true'
    )
    expect(payload['or1']).to eq(true)
    expect(payload['or2']).to eq(false)
    expect(payload['or3']).to eq(true)
    expect(payload['or4']).to eq(true)
    expect(payload['and1']).to eq(false)
    expect(payload['and2']).to eq(false)
    expect(payload['and3']).to eq(false)
    expect(payload['and4']).to eq(true)
  end

  it 'supports boolean vector comparisons' do
    payload = run_script(
      '@v1 = [ true, false, false, true ]
       @v2 = [ false, false, true, true ]
       @or = @v1 || @v2
       @and = @v1 && @v2'
    )
    expect(payload['or']).to be_a(Archimedes::Vector)
    expect(payload['or'].to_values).to eq([ true, false, true, true ])
    expect(payload['and']).to be_a(Archimedes::Vector)
    expect(payload['and'].to_values).to eq([ false, false, false, true ])
  end
end
