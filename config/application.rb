require_relative "boot"
require "rack/cors" 

require "rails/all"

Bundler.require(*Rails.groups)

module Action
  class Application < Rails::Application
    config.load_defaults 7.1

    # CORS configuration, consider to remove this and use a proper token based security
    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'  # Adjust to your needs, '*' allows all origins
        resource '*', headers: :any, methods: [:get, :post, :options]
      end
    end
    config.action_controller.allow_forgery_protection = false

  end
end