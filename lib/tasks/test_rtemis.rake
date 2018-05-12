namespace :timur do
  task test_rtemis: :environment do
    token = '42cb21139fc1feb38a5cc350031d9e487fa7e9748acc68e5ef068b1fd9ec247f'
    #m = Magma::Client.instance.query(
      #token, 'ipi', 
      #["sample", ["patient", "::has", "experiment"], "::all", [["sample_name"], ["patient", "experiment", "name"], ["population", ["name", "::equals", "CD45+"], ["stain", "::equals", "sort"], "::first", "count"], ["population", ["name", "::equals", "Live"], ["stain", "::equals", "sort"], "::first", "count"]]]
    #);
    #json = JSON.parse(m.body)
    #col_names = [ 'sample_name', 'experiment_name', 'cd45_count', 'live_count' ]
    #m = Archimedes::Matrix.new( json['answer'].map(&:first), col_names, json['answer'].map do |row_name,row|
      #Archimedes::Vector.new(col_names.zip(row))
    #end)
    m1_cols = ('a'..'e').to_a
    m2_cols = ('f'..'j').to_a
    m1 = Archimedes::Matrix.new( [ 'ant', 'bear', 'cat' ], m1_cols, 3.times.map{ Archimedes::Vector.new( m1_cols.zip(5.times.map{rand}) ) })
    m2 = Archimedes::Matrix.new( [ 'ant', 'bear', 'cat' ], m1_cols, 3.times.map{ Archimedes::Vector.new( m1_cols.zip(5.times.map{rand}) ) })
    m3 = Archimedes::Function.call(token, 'ipi', 'wilcox', [m1, m2])
    binding.pry
  end
end
