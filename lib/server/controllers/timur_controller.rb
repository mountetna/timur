class Timur
  class Controller < Etna::Controller
    VIEW_PATH=File.expand_path('../views', __dir__)

    private

    def redirect_to(path)
      @response.redirect(path,302)
      @response.finish
    end

    def success_json(hash)
      success(hash.to_json, 'application/json')
    end

    def config_json
      {
        project_name: @params[:project_name],
        token_name: Timur.instance.config(:token_name),
        magma_host: Timur.instance.config(:magma)[:host],
        metis_host: Timur.instance.config(:metis)[:host],
        metis_uid_name: Timur.instance.config(:metis_uid_name),
        janus_host: Timur.instance.config(:auth_redirect)
      }.to_json
    end

    def token
      @token ||= @request.cookies[Timur.instance.config(:token_name)]
    end

    def current_user
      @current_user ||= User.find_or_create(email: @user.email) do |user|
        user.name = "#{@user.first} #{@user.last}"
      end.tap do |cuser|
        cuser.etna_user = @user
      end
    end
  end
end
