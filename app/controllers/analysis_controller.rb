# AnalysisController provides JSON endpoints for an external application to request necessary data.

class AnalysisController <  ApplicationController
  before_filter :authenticate
  before_filter :readable_check
  before_filter :editable_check, only: :update

  def gating_tree
    # returns the gating tree (gate names + vertices) for a given sample and stain
    sample_name = params[:sample_name]
    stain = params[:stain]

    sample = Sample.where(ipi_number: @sample_name)
    
    # Next we find the populations associated with
    # this stain

    stain_populations = sample.populations.where(stain: stain)

    # Report the population tree along with gates

    # Then we return the gates for this file:
    render json: {
      sample_name: sample_name,
      stain: stain,
      populations: stain_populations.map do |pop|
        gating_json(pop)
      end
    }
  end
end
