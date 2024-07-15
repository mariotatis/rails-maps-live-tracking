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

  // const markerCount = window.markerCount;
  // for (let i = 0; i < markerCount; i++) {
  //   let markerId = `marker_${i}`;
  //   let marker = new google.maps.Marker({
  //     position: {
  //       lat: startPosition.lat + (Math.random() - 0.002) * 0.002,
  //       lng: startPosition.lng + (Math.random() - 0.002) * 0.002
  //     },
  //     label: "" + i,
  //     map: map,
  //     markerId: markerId,
  //     metadata: {
  //       name: `Marker ${i}`,
  //       description: `Description for marker ${i}`,
  //       lastPositionChange: new Date()
  //     }
  //   });
  //   markers[markerId] = marker;
  // }
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
      marker.metadata.lastPositionChange = new Date(); // Update last position change date
    }
  }, 20);
}

window.updateMap = function(data) {
  if (map) {
    data.locations.forEach(location => {
      let markerId = location.markerId;
      let newPosition = new google.maps.LatLng(location.latitude, location.longitude);
      if (markers[markerId]) {
        animateMarker(markers[markerId], newPosition);
        console.log(`Marker ${markerId} moved to:`, newPosition);
      } else {
        // Create a new marker if it doesn't exist
        let marker = new google.maps.Marker({
          position: newPosition,
          map: map,
          markerId: markerId,
          metadata: {
            name: `New Marker ${markerId}`,
            description: `Description for new marker ${markerId}`,
            lastPositionChange: new Date()
          }
        });
        markers[markerId] = marker;
        console.log(`New marker ${markerId} created at:`, newPosition);
      }
    });
  } else {
    console.error("Map is not initialized.");
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

// Get marker and its metadata
// const markerId = 'marker_1';
// const marker = markers[markerId];

// if (marker) {
//   const pos = marker.getPosition();
//   const latitude = pos.lat();
//   const longitude = pos.lng();
//   console.log(`Marker ${markerId} current position: lat=${latitude}, lng=${longitude}`);
//   console.log(`Marker ${markerId} metadata:`, marker.metadata);
// } else {
//   console.log('Marker not found with markerId:', markerId);
// }