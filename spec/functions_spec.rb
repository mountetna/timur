require_relative '../app/models/archimedes'

describe Archimedes::Default do
  context '#length' do
    it 'computes vector length' do
      payload = run_script(
        vec: '[ 1, 2, 3 ]',
        length: 'length(@vec)'
      )
      expect(payload['length']).to eq(3)
    end
    it 'computes vector max' do
      payload = run_script(
        vec: '[ 1, 2, 3 ]',
        max: 'max(@vec)'
      )
      expect(payload['max']).to eq(3)
    end
    it 'computes vector min' do
      payload = run_script(
        vec: '[ 1, 2, 3 ]',
        min: 'min(@vec)'
      )
      expect(payload['min']).to eq(1)
    end
    it 'computes log of a vector' do
      payload = run_script(
        vec: '[ 10, 100, 1000 ]',
        log: 'log(@vec,10)'
      )
      vector = payload['log']
      binding.pry
      expect(vector).to be_a(Archimedes::Vector)
      expect(vector.to_values).to eq([1,2,3])
    end
    it 'computes log of a number' do
      payload = run_script(
        log: 'log(1000,10)'
      )
      expect(payload['log'].round(4)).to eq(3)
    end
  end
end
