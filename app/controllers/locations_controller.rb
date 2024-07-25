class LocationsController < ApplicationController
  protect_from_forgery with: :null_session
  # :-( This never worked for me so I disabled it in config/application.rg
  
  def update_location
    lat = params[:lat].to_f
    lng = params[:lng].to_f
    marker_id = params[:marker_id]

    render json: { message: "Received location update: lat=#{lat}, lng=#{lng}, marker_id=#{marker_id}" }, status: :ok

    ActionCable.server.broadcast('locations_channel', {
      locations: [{
        markerId: marker_id,
        latitude: lat,
        longitude: lng,
        speed: rand(50..120),
        time: Time.now
      }]
    })
  end
end