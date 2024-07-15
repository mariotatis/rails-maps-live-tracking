class PagesController < ApplicationController

  def home
    @markers = 5
  end

  def simulate_updates
    puts "*" * 80
    existing_marker_ids = ["marker_1", "marker_2", "marker_3", "marker_4", "marker_0"]

    threads = existing_marker_ids.map do |marker_id|
      Thread.new do
        5.times do
          sleep(2)
          location = {
            markerId: marker_id,
            latitude: 11.0114114 + rand(-0.001..0.005),
            longitude: -74.8162187 + rand(-0.001..0.005),
            speed: rand(50..80),
            time: Time.now
          }
          ActionCable.server.broadcast('locations_channel', {
            locations: [location]
          })
        end
      end
    end

    threads.each(&:join)

    head :ok
  end
end