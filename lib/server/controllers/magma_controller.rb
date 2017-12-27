class MagmaController < Timur::Controller
  def update
    begin
      response = Magma::Client.instance.update(
        token,
        @params[:project_name],
        @params[:revisions]
      )
      return success(response.body, 'application/json')
    rescue Magma::ClientError => e
      failure(e.status, e.body)
    end
  end

  def retrieve_tsv
    begin
      filename = "#{@params[:model_name]}.tsv"
      @response['Content-Type'] = 'text/tsv'
      @response['Content-Disposition'] = %Q( attachment; filename="#{filename}" )

      Magma::Client.instance.retrieve(
        token,
        @params[:project_name],
        model_name: @params[:model_name],
        record_names: @params[:record_names],
        attribute_names: 'all',
        filter: @params[:filter],
        format: 'tsv'
      ) do |magma_response |
        magma_response.read_body do |chunk|
        # this needs to use rack chunks instead
          @response.stream.write(chunk)
        end
        @response.stream.close
      end
    rescue Magma::ClientError => e
      failure(e.status, e.body)
    end
  end

  def retrieve
    begin
      magma = Magma::Client.instance
      response = magma.retrieve(
        token, @params[:project_name],
        @params
      )
      success(response.body, 'application/json')
    rescue Magma::ClientError => e
      failure(e.status, e.body)
    end
  end
  
  def query
    begin
      magma = Magma::Client.instance
      response = magma.query(
        token, @params[:project_name],
        @params[:question]
      )
      success(response.body, 'application/json')
    rescue Magma::ClientError => e
      failure(e.status, e.body)
    end
  end
end
