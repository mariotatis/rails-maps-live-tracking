class PagesController < ApplicationController
  
  # These are the starting position
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

  def home;end

  #this can be refactored on a public actionCable method and receive params
  def start_data
    START_POINTS.each_with_index do |path, i|
      ActionCable.server.broadcast('locations_channel', {
        locations: [{
          markerId: i,
          latitude: path[0],
          longitude: path[1],
          time: Time.now
        }]
      })
      sleep(rand(1..3))
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