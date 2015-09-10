class QcPlotJson
  include PlotHelper
  include PopulationHelper

  attr_reader :record, :indication
  def initialize record
    @record = record
    @indication = record.patient.experiment
  end

  def to_json
    {
      plot: {
        name: 'qc',
        width: 300,
        height: 200,
        margin: { top: 10, right: 20, bottom: 60, left: 50},
      },
      data: [
        {
          series: "CD45+/live",
          color: "greenyellow",
          height: get_ratio(:treg, "CD45+", "Live")
        },
        {
          series: "CD45+/live",
          color: "coral",
          height: get_ratio(:nktb, "CD45+", "Live")
        },
        {
          series: "CD45+/live",
          color: "khaki",
          height: get_ratio(:sort, "CD45+", "Live")
        },
        {
          series: "CD45+/live",
          color: "seagreen",
          height: get_ratio(:dc, "CD45+", "Live")
        }
      ],
      legend: {
        series: [ "treg", "nk/t/b", "sort", "dc" ],
        colors: [ "greenyellow", "coral", "khaki", "seagreen" ]
      }
    }
  end
end
