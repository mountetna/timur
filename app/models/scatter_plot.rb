class ScatterPlot
  include PlotHelper
  include PopulationHelper

  def initialize params
    Rails.logger.info params
    @x_var = Mapping.new params[:x]
    @y_var = Mapping.new params[:y]
    @all_series = params[:series].map do |series|
      Series.new series
    end
  end

  def to_json
    # you should return an array of objects with name, x/y pairs, and colors
    {
      plot: {
          name: 'scatter',
          width: 900,
          height: 300,
          margin: { top: 30, right: 250, bottom: 30, left: 150},
      },
      series: x_y_data_by_series
    }
  end

  private 

  def x_y_data_by_series
    @all_series.map do |series|
      {
        values: x_y_data(series),
        key: series.key
      }
    end
  end

  def x_y_data series
    x_values = series.map_by @x_var
    y_values = series.map_by @y_var

    points = x_values.zip(y_values, series.samples.map(&:sample_name)).map do |data|
      {
        x: data[0],
        y: data[1],
        name: data[2]
      }
    end

    points.reject do |point|
      point[:x].nil? || point[:y].nil?
    end
  end
end
