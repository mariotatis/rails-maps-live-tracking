let map;
let markers = {};
let directionsService;
let directionsRenderer;

const ANIMATION_DURATION = 800000; // Total animation duration in milliseconds
const ANIMATION_INTERVAL = 20; // Interval between position updates in milliseconds

const customMapStyle = [
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "landscape", elementType: "labels", stylers: [{ visibility: "off" }] }
];

function initMap() {
  const startPosition = { lat: 11.0114114, lng: -74.8162187 };

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: startPosition,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: customMapStyle
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true // Hide default markers
  });

  // Example start and end addresses
  const startAddress = 'Via 40 #calle 85, Riomar, Barranquilla, Atlántico'; // Replace with your start address
  const endAddress = 'Cl. 47 #56-12, Barranquilla, Atlántico'; // Replace with your end address

  // Calculate and display the route
  calculateAndDisplayRoute(startAddress, endAddress);
}

function calculateAndDisplayRoute(startAddress, endAddress) {
  directionsService.route({
    origin: startAddress,
    destination: endAddress,
    travelMode: google.maps.TravelMode.DRIVING // Change travel mode if needed
  }, (response, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setOptions({
        polylineOptions: {
          strokeColor: '#eb62a9', // Change the color here
          strokeOpacity: 0.5, // Change the opacity here
          strokeWeight: 15 // Change the line thickness here
        }
      });
      directionsRenderer.setDirections(response);

      const directionsData = response.routes[0].overview_path;

      function addCircle(position, label, color) {
        new google.maps.Circle({
          center: position,
          radius: 20, 
          fillColor: color,
          fillOpacity: 0.6, 
          strokeColor: color,
          strokeOpacity: 0.8, 
          strokeWeight: 2, 
          map: map,
          clickable: false 
        });

        new google.maps.Marker({
          position: position,
          map: map,
          label: {
            text: label,
            color: '#000000',
            fontSize: '16px', // Adjust font size
            fontWeight: 'bold' // Make text bold
          },
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 0 // Hide default icon; only show the circle
          }
        });
      }

      addCircle(directionsData[0], 'Start', '#6caffb'); 
      addCircle(directionsData[directionsData.length - 1], 'End', '#6caffb'); 

    } else {
      console.error('Directions request failed due to ' + status);
    }
  });
}

function animateMarker(marker, newPosition) {
  const currentPos = marker.getPosition();
  const totalFrames = ANIMATION_DURATION / ANIMATION_INTERVAL;
  const deltaLat = (newPosition.lat() - currentPos.lat()) / totalFrames;
  const deltaLng = (newPosition.lng() - currentPos.lng()) / totalFrames;

  let frame = 0;
  const interval = setInterval(() => {
    if (frame < totalFrames) {
      const newLat = currentPos.lat() + deltaLat * frame;
      const newLng = currentPos.lng() + deltaLng * frame;
      marker.setPosition({ lat: newLat, lng: newLng });
      frame++;
    } else {
      clearInterval(interval);
      marker.setPosition(newPosition); // Ensure the final position is set
    }
  }, ANIMATION_INTERVAL);
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
        // Add new marker
        let marker = new google.maps.Marker({
          position: newPosition,
          map: map,
          markerId: markerId,
          icon: {
            url: "https://myapp.koombea.com/temp/carnaval/" + markerId + ".png", // Custom image URL
            scaledSize: new google.maps.Size(60, 60), // Adjust size as needed
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 20)
          },
          metadata: {
            name: "hello",
            description: "world",
            lastPositionChange: new Date()
          }
        });

        // Add a click event listener to the marker
        const infoWindow = new google.maps.InfoWindow({
          content: `<div>
              Marker ID: ${markerId}
              <br>Latitude: ${location.latitude}
              <br>Longitude: ${location.longitude}
            </div>`
        });

        marker.addListener('click', function() {
          infoWindow.open(map, marker);
        });

        markers[markerId] = marker;
        console.log(`New marker ${markerId} created at:`, newPosition);
      }
    });
  } else {
    console.error("Map is not initialized.");
  }
};