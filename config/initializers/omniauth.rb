if defined? OmniAuth
  Rails.application.config.middleware.use OmniAuth::Builder do
    provider :shibboleth, {
      :shib_session_id_field     => "Shib-Session-ID",
      :shib_application_id_field => "Shib-Application-ID",
      :request_type              => :header,
      :debug                     => false,
      :info_fields => {
        :email => "email",
        :ucsf_id => "ucsfEduIdNumber",
      },
      :extra_fields => [ :"unscoped-affiliation", :entitlement ]
    }
  end
end
