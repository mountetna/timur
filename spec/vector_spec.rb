require_relative '../lib/models/archimedes/vector'

def vector(items)
  Archimedes::Vector.new(items.map{|i| [ nil, i ]})
end

describe Archimedes::Vector do
  it "supports arithmetic by a constant" do
    v = vector([1,2,3])
    o1 = v * 3
    o2 = v + 3
    o3 = v / 0.5
    o4 = v - 3

    expect([o1, o2, o3, o4]).to all(be_a(Archimedes::Vector))
    expect(o1.to_values).to eq([3,6,9])
    expect(o2.to_values).to eq([4,5,6])
    expect(o3.to_values).to eq([2,4,6])
    expect(o4.to_values).to eq([-2,-1,0])
  end
  it "supports comparison to a constant" do
    v = vector([1,2,3])
    o1 = v > 2
    o2 = v < 2
    o3 = v <= 2
    o4 = v >= 2
    o5 = v == 2

    expect([o1, o2, o3, o4, o5]).to all(be_a(Archimedes::Vector))
    expect(o1.to_values).to eq([false,false,true])
    expect(o2.to_values).to eq([true,false,false])
    expect(o3.to_values).to eq([true,true,false])
    expect(o4.to_values).to eq([false,true,true])
    expect(o5.to_values).to eq([false,true,false])
  end
  it "supports arithmetic by a vector" do
    v1 = vector([1,2,3])
    v2 = vector([1,2,3])
    o1 = v1 * v2
    o2 = v1 + v2
    o3 = v1 / v2
    o4 = v1 - v2

    expect([o1, o2, o3, o4]).to all(be_a(Archimedes::Vector))
    expect(o1.to_values).to eq([1,4,9])
    expect(o2.to_values).to eq([2,4,6])
    expect(o3.to_values).to eq([1,1,1])
    expect(o4.to_values).to eq([0,0,0])
  end
  it "supports comparison to a vector" do
    v1 = vector([1,2,3])
    v2 = vector([4,1,3])
    o1 = v1 > v2
    o2 = v1 < v2
    o3 = v1 <= v2
    o4 = v1 >= v2
    o5 = v1 == v2

    expect([o1, o2, o3, o4, o5]).to all(be_a(Archimedes::Vector))
    expect(o1.to_values).to eq([false,true,false])
    expect(o2.to_values).to eq([true,false,false])
    expect(o3.to_values).to eq([true,false,true])
    expect(o4.to_values).to eq([false,true,true])
    expect(o5.to_values).to eq([false,false,true])
  end
  it "supports arbitrary operations across vectors" do
    v1 = vector([10,100,1000])

    o = v1.op {|v| Math.log(v, 10) }
    expect(o).to be_a(Archimedes::Vector)
    expect(o.to_values.map{|v| v.round(4)}).to eq([1,2,3])
  end
  it "supports vector concatenation" do
    v1 = vector([1,2,3])
    v2 = vector([4,5,6])

    o = v1.concat(v2)
    expect(o).to be_a(Archimedes::Vector)
    expect(o.to_values).to eq([1,2,3,4,5,6])
  end
  it "supports logical inversion" do
    v1 = vector([true,false,true])
    v2 = !v1

    expect(v2).to be_a(Archimedes::Vector)
    expect(v2.to_values).to eq([false,true,false])
  end
end
