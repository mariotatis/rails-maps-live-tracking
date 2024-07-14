let map;
let markers = {};

function initMap() {
  const startPosition = { lat: 11.0114114, lng: -74.8162187 };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: startPosition,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false
  });

  const markerCount = window.markerCount;
  for (let i = 0; i < markerCount; i++) {
    let markerId = `marker_${i}`;
    let marker = new google.maps.Marker({
      position: {
        lat: startPosition.lat + (Math.random() - 0.002) * 0.002,
        lng: startPosition.lng + (Math.random() - 0.002) * 0.002
      },
      label: "" + i,
      map: map,
      markerId: markerId
    });
    markers[markerId] = marker;
  }
}

function animateMarker(marker, newPosition) {
  const currentPos = marker.getPosition();
  const deltaLat = (newPosition.lat() - currentPos.lat()) / 100;
  const deltaLng = (newPosition.lng() - currentPos.lng()) / 100;

  let i = 0;
  const interval = setInterval(() => {
    if (i < 100) {
      marker.setPosition({
        lat: currentPos.lat() + deltaLat * i,
        lng: currentPos.lng() + deltaLng * i
      });
      i++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

window.updateMap = function(data) {
  if (map && Object.keys(markers).length > 0) {
    data.locations.forEach(location => {
      let markerId = location.markerId;
      if (markers[markerId]) {
        let newPosition = new google.maps.LatLng(location.latitude, location.longitude);
        animateMarker(markers[markerId], newPosition);
        console.log(`Marker ${markerId} moved to:`, newPosition);
      } else {
        console.error(`Marker with markerId ${markerId} not found.`);
      }
    });
  } else {
    console.error("Map or markers are not initialized.");
  }
};

document.addEventListener('DOMContentLoaded', function() {
  initMap();

  document.getElementById('start-simulation-btn').addEventListener('click', function(event) {
    event.preventDefault();
    fetch('/simulate_updates')
      .then(response => response.text())
      .then(data => console.log("Simulation started:", data))
      .catch(error => console.error('Error:', error));
  });
});


//get marker
// const markerId = 'marker_1';
// const marker = markers[markerId];

// if (marker) {
//   const pos = marker.getPosition();
//   const latitude = pos.lat();
//   const longitude = pos.lng();
//   console.log(`Marker ${markerId} current position: lat=${latitude}, lng=${longitude}`);
// } else {
//   console.log('Marker not found with markerId:', markerId);
// }