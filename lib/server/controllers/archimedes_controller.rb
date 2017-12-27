class SearchController <  Timur::Controller
  def consignment_json
    begin
      consignment = Hash[
        params[:queries].map do |query|
          [
            query[:name],
            Archimedes::Manifest.new(
              token,
              params[:project_name],
              query[:manifest]
            ).payload
          ]
        end
      ]
      render(json: consignment)
    rescue Archimedes::LanguageError => e
      render(json: e.body, status: 422)
    end
  end
end

