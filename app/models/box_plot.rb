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

class BoxPlot
  def initialize params
    @mappings = params[:mappings].map do |key|
      current_user.get_save(key: key)
    end
    @series = params[:series].map do |key|
      current_user.get_save(key: key)
    end
  end

  def to_json
    # you should return an array of objects with name, x/y pairs, and colors
    {
      series: @series.map do |series|
        series.key
      end,
      mappings: @mappings.map do |mapping|
        mapping.key
      end,
      data: data_matrix
    }
  end

  private 
  def data_matrix series
    @series.map do |series|
      matrix = @mappings.map do |mapping|
        series.map_by mapping
      end
      { 
        # you need to name your samples
        samples: series.samples.map(&:sample_name),
        values: matrix
      }
    end
  end
end
