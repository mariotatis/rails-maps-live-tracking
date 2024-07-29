class PagesController < ApplicationController
  # Define the path with 14 points

  START_POINTS = [
    [11.0266192, -74.8040628],
    [11.0272510, -74.8046100],
    [11.0278724, -74.8051465],
    [11.0286727, -74.8058760],
    [11.0293572, -74.8064661],
    [11.0299890, -74.8070240]
  ]

  PATH_POINTS = [         
    [11.005383, -74.788976]
  ]

  def home
    @markers = 5
  end

  def start_data
    START_POINTS.each_with_index do |path, i|
      sleep(rand(1..3))
      ActionCable.server.broadcast('locations_channel', {
        locations: [{
          markerId: i,
          latitude: path[0],
          longitude: path[1],
          time: Time.now
        }]
      })
    end
  end

  def simulate_updates
    START_POINTS.each_with_index do |path, i|
      ActionCable.server.broadcast('locations_channel', {
        locations: [{
          markerId: i,
          latitude: "11.014595",
          longitude: "-74.794259",
          speed: 5,
          time: Time.now
        }]
      })
    end
  end
end