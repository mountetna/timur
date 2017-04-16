if Rails.env.development?
  JsRoutes.setup do |config|
    config.prefix = '/' + ENV["DEV_USER"]
  end
end
