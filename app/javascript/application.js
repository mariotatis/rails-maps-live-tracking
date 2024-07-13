// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "channels"


// Example of initializing a map and adding a marker
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: -34.397, lng: 150.644}
  });

  var marker = new google.maps.Marker({
    position: {lat: -34.397, lng: 150.644},
    map: map
  });
}
