class Cd45Plot
  def initialize record
    @record = record
  end

  def to_hash
    Experiment.where(:project_id => @record.id).map do |e|
      cd45_counts  = Population.join(:samples, :id => :sample_id)
        .join(:patients, :id => :patient_id )
        .where('experiment_id = ?', e.id)
        .where(stain: 'sort')
        .where(name: "CD45+")
        .order(:sample_id).select_map :count
      live_counts  = Population.join(:samples, :id => :sample_id)
        .join(:patients, :id => :patient_id )
        .where('experiment_id = ?', e.id)
        .where(stain: 'sort')
        .where(name: "Live")
        .order(:sample_id).select_map :count
      # pull cd45 counts and live counts
      counts = cd45_counts.zip(live_counts).reject do |c,l|
        !c || !l
      end
      next if !counts || counts.empty?
      {
        series: e.name,
        values: counts.map do |k|
          (k[0] / k[1].to_f).round(3)
        end
      }
    end.compact
  end
end
