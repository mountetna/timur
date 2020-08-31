require_relative '../../lib/models/archimedes'

describe Archimedes::VectorFunctions do
  it 'computes vector length' do
    payload = run_script(
     '@vec = [ 1, 2, 3 ]
      @length = length(@vec)'
    )
    expect(payload['length']).to eq(3)
  end

  it 'computes unique vector' do
    payload = run_script(
     '@vec = [ 2, 1, 3, 4, 3, 2, 3, 4 ]
      @unique = unique(@vec)'
    )
    vector = payload['unique']
    expect(vector).to be_a(Archimedes::Vector)
    expect(vector.to_values).to eq([2,1,3,4])
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
  it 'extracts labels' do
    payload = run_script(
     "@vec = [ a: 1, b: 2, c: 3 ]
      @labels = labels(@vec)"
    )
    expect(payload['labels'].to_values).to eq(['a','b','c'])
  end
  it 'generates a sequence' do
    payload = run_script(
     "@vec = seq(1,10)
      @vec2 = seq(1,20,2)"
    )
    expect(payload['vec'].to_values).to eq((1..10).to_a)
    expect(payload['vec2'].to_values).to eq([1,3,5,7,9,11,13,15,17,19])
  end
  it 'repeats a vector' do
    payload = run_script(
      "@vec = [1,2,3]
       @rep = rep(@vec,3)"
    )
    expect(payload['rep'].to_values).to eq([1,2,3]*3)
  end
  it 'joins vector elements into a string' do
    payload = run_script(
      "@vec = ['a','b','c']
       @join = join(@vec)
       @join2 = join(@vec, ', ')"
    )
    expect(payload['join']).to eq('abc')
    expect(payload['join2']).to eq('a, b, c')
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

  it 'groups vector values by label' do
    payload = run_script(
      "@factors = [ 'a', 'a', 'a', 'b', 'b', 'b', 'b' ]
       @data = [ m: 1, n: 3, o: 5, p: 1, q: 4, r: 9, s: 16 ]
       @groups = group(@data, @factors)"
    )
    expect(payload['groups']).to eq([])
  end
end
