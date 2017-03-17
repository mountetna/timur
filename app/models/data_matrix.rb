# To make a box plot, we need:
# {
#   "series": [ 'xyzzy' ] # the name for a series.
#   "mappings": [ 'zyxxy' ] # the name for a set of mappings
# }
#
# Using this, we will return a series => samplesx{mappings} data matrix
# {
#   "data": [ [], [] ]
#   "series": [ 'xyzzy' ]
#   "mappings": [ 'zyxxy' ]
# }

class DataMatrix
  def initialize params, user
    @mappings = params[:mappings].map do |key|
      user.get_save(key)
    end
    @series = params[:series].map do |key|
      user.get_save(key)
    end
  end

  def to_json
    # you should return an array of objects with name, x/y pairs, and colors
    {
      series: data_matrix
    }
  end

  private 
  def data_matrix
    @series.map do |series|
      {
        # you need to name your samples
        name: series.name,
        key: series.key,
        matrix: {
          col_names: series.samples.map(&:sample_name),
          row_names: @mappings.map(&:name),
          rows: @mappings.map do |mapping|
            series.map_by mapping
          end
        }
      }
    end
  end
end
