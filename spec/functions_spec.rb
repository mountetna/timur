require_relative '../lib/models/archimedes'

describe Archimedes::Default do
  it 'computes vector length' do
    payload = run_script(
     '@vec = [ 1, 2, 3 ]
      @length = length(@vec)'
    )
    expect(payload['length']).to eq(3)
  end
  it 'computes vector max' do
    payload = run_script(
     '@vec = [ 1, 2, 3 ]
      @max = max(@vec)'
    )
    expect(payload['max']).to eq(3)
  end
  it 'computes vector min' do
    payload = run_script(
     '@vec = [ 1, 2, 3 ]
      @min = min(@vec)'
    )
    expect(payload['min']).to eq(1)
  end
  it 'computes log of a vector' do
    payload = run_script(
     '@vec = [ 10, 100, 1000 ]
      @log = log(@vec,10)'
    )
    vector = payload['log']
    expect(vector).to be_a(Archimedes::Vector)
    expect(vector.to_values.map{|v| v.round(4)}).to eq([1,2,3])
  end
  it 'computes log of a number' do
    payload = run_script('@log = log(1000,10)')
    expect(payload['log'].round(4)).to eq(3)
  end
  it 'allows string labels' do
    payload = run_script("@vec = [ 'the city': 'syracusa' ]")
    expect(payload['vec']['the city']).to eq('syracusa')
  end
  it 'sets new labels' do
    payload = run_script(
     "@vec = [ 1, 2, 3 ]
      @labels = [ 'a', 'b', 'c' ]
      @labeled = label(@vec, @labels)"
    )
    values = [ 'a', 'b', 'c' ].map{|l| payload['labeled'][l]}
    expect(values).to eq([1,2,3])
  end
  it 'concats two vectors' do
    payload = run_script(
     '@vec1 = [ 1, 2, 3 ]
      @vec2 = [ 4, 5, 6 ]
      @vec3 = concat(@vec1, @vec2)'
    )
    expect(payload['vec3'].to_values).to eq([1,2,3,4,5,6])
  end
  it 'checks if any value in a vector is true' do
    payload = run_script(
     '@vec1 = [ 1, 2, 3 ]
      @vec2 = [ 1, 5, 6 ]
      @vec3 = [ 4, 5, 6 ]
      @any1 = any(@vec1 == @vec2)
      @any2 = any(@vec1 == @vec3)'
    )
    expect(payload['any1']).to be_truthy
    expect(payload['any2']).to be_falsy
  end
  it 'checks if all values in a vector are true' do
    payload = run_script(
     '@vec1 = [ 1, 2, 3 ]
      @vec2 = [ 1, 2, 3 ]
      @vec3 = [ 1, 0, 0 ]
      @vec4 = [ 4, 5, 6 ]
      @all1 = all(@vec1 == @vec2)
      @all2 = all(@vec1 == @vec3)
      @all3 = all(@vec1 == @vec4)'
    )
    expect(payload['all1']).to be_truthy
    expect(payload['all2']).to be_falsy
    expect(payload['all3']).to be_falsy
  end
end
