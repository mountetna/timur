class ProgressPlot
  def initialize record
    @record = record
  end

  def to_hash
    samples = Sample.where('date_of_digest IS NOT NULL').order(:date_of_digest)

    [
      {
        values: samples.map.with_index do |s,i|
          { x: s.date_of_digest, y: i }
        end,
        series: :total,
        color: :mediumseagreen
      },
      {
        values: samples.where(sample_name: /.T1$/).map.with_index do |s,i|
          { x: s.date_of_digest, y: i }
        end,
        series: :tumor,
        color: :indigo
      },
      {
        values: samples.where(sample_name: /.N1$/).map.with_index do |s,i|
          { x: s.date_of_digest, y: i }
        end,
        series: :normal,
        color: :cornflowerblue
      }
    ]
  end
end
