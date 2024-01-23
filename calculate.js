function calculateDistanceAndBearing() {
    // Get input values
    const lat1 = parseFloat(document.getElementById('lat1').value);
    const lon1 = parseFloat(document.getElementById('lon1').value);
    const lat2 = parseFloat(document.getElementById('lat2').value);
    const lon2 = parseFloat(document.getElementById('lon2').value);
  
    // Validate input
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
      alert('Please enter valid numeric coordinates.');
      return;
    }
  
    // Convert coordinates to radians
    const radLat1 = (lat1 * Math.PI) / 180;
    const radLon1 = (lon1 * Math.PI) / 180;
    const radLat2 = (lat2 * Math.PI) / 180;
    const radLon2 = (lon2 * Math.PI) / 180;
  
    // Haversine formula to calculate distance
    const dLat = radLat2 - radLat1;
    const dLon = radLon2 - radLon1;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c; // Earth radius is approximately 6371 km
  
    // Bearing calculation
    const y = Math.sin(dLon) * Math.cos(radLat2);
    const x = Math.cos(radLat1) * Math.sin(radLat2) - Math.sin(radLat1) * Math.cos(radLat2) * Math.cos(dLon);
    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  
    // Adjust bearing to be within the range [0, 360)
    bearing = (bearing + 360) % 360;
  
    // Determine cardinal direction
    let direction;
    if (bearing >= 337.5 || bearing < 22.5) {
      direction = 'North';
    } else if (bearing >= 22.5 && bearing < 67.5) {
      direction = 'Northeast';
    } else if (bearing >= 67.5 && bearing < 112.5) {
      direction = 'East';
    } else if (bearing >= 112.5 && bearing < 157.5) {
      direction = 'Southeast';
    } else if (bearing >= 157.5 && bearing < 202.5) {
      direction = 'South';
    } else if (bearing >= 202.5 && bearing < 247.5) {
      direction = 'Southwest';
    } else if (bearing >= 247.5 && bearing < 292.5) {
      direction = 'West';
    } else if (bearing >= 292.5 && bearing < 337.5) {
      direction = 'Northwest';
    }
  
    // Get town and cyclone names from textboxes
    const townName = document.getElementById('townName').value;
    const cycloneName = document.getElementById('cycloneName').value;

  // Display results
  const resultText = `Distance: ${distance.toFixed(2)} km<br>Bearing: ${bearing.toFixed(2)} degrees (${direction})`;
  const resultElement = document.getElementById('result');
  resultElement.innerHTML = resultText;

  // Show result section
  resultElement.classList.add('show');

  // Clear previous map content
  const mapElement = document.getElementById('map');
  mapElement.innerHTML = '';

  // Remove previous map instance (if exists)
  if (mapElement._leaflet_id) {
    mapElement._leaflet_id = null;
  }

  // Create a new map
  const map = L.map('map').setView([12.8797, 121.7740], 6); // Centered on Philippines

  // Add OpenStreetMap as the basemap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add markers for the two points with labels
  const townMarker = L.marker([parseFloat(lat1), parseFloat(lon1)]).addTo(map);
  townMarker.bindPopup(`<b>${townName}</b>`).openPopup(); // Add town name label

  const cycloneMarker = L.marker([parseFloat(lat2), parseFloat(lon2)]).addTo(map);
  cycloneMarker.bindPopup(`<b>${cycloneName}</b>`).openPopup(); // Add cyclone name label

  // Draw a line between the two points
  const line = L.polyline([
    [parseFloat(lat1), parseFloat(lon1)],
    [parseFloat(lat2), parseFloat(lon2)]
  ]).addTo(map);

  // Fit the map to the markers and line
  map.fitBounds([townMarker.getLatLng(), cycloneMarker.getLatLng(), line.getBounds().getCenter()]);
}
  