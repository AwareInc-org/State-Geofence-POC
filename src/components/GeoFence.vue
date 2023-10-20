//HTML Section
//Using PrimeVue for buttons and text fields
<template>
  <div>
    <div id="map" style="width: 100%; height: 400px;"></div>
    <div class="coord-container">
      <p-inputtext v-model="customLat" placeholder="Latitude"></p-inputtext>
      <p-inputtext v-model="customLng" placeholder="Longitude"></p-inputtext>
    </div>
    <div class="button-container">
      <p-button label="Check Coordinates" @click="checkCustomCoords"></p-button>
      <p-button label="Use Current Location" @click="setCurrentLocation"></p-button>
      <p-button label="Random Location" @click="setRandomLocation"></p-button>
    </div>
  </div>
</template>

//Script Section

<script>

// Importing required libraries and assets (leaflet,geoJSON, turf)
import L from 'leaflet'; 
import 'leaflet/dist/leaflet.css'; 
import geojsonData from '../assets/us-states.json'; 
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'; 
import Button from 'primevue/button'; 
import InputText from 'primevue/inputtext'; 

export default {
  name: "GeoFenceMap", // Component name
  
  components: { // Registering the components to be used in this component's template
    'p-button': Button,
    'p-inputtext': InputText
  },
  
  data() { // Component's reactive data properties
    return {
      map: null, // Will hold the Leaflet map instance
      geojsonLayer: null, // Will hold the geoJSON layer
      highlightedLayers: [], // For future use, not currently utilized
      customLat: '', // Bound to Latitude input box
      customLng: '', // Bound to Longitude input box
      marker: null // Will hold the map marker instance
    };
  },
  
  mounted() { // Lifecycle hook when the component is added to the DOM
    this.initMap(); // Initialize the map
  },
  
  methods: { // Methods for the component
  
    initMap() { // Method to initialize the map
      this.map = L.map('map').setView([37.8, -96], 4); // Create a map centered on the US
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map); // Add OSM tile layer to the map

      // Fixing default paths for the marker images
      const iconRetinaUrl = require('@/assets/marker-icon-2x.png');
      const iconUrl = require('@/assets/marker-icon.png');
      const shadowUrl = require('@/assets/marker-shadow.png');
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl,
        iconUrl,
        shadowUrl
      });

      // Adding geoJSON data to the map and setting style on feature click
      this.geojsonLayer = L.geoJSON(geojsonData, {
        onEachFeature: (feature, layer) => {
          layer.on('click', () => {
            if (layer.isHighlighted) {
              layer.setStyle({
                fillColor: '',
                fillOpacity: 0.2
              });
              layer.isHighlighted = false;
            } else {
              layer.setStyle({
                fillColor: 'red',
                fillOpacity: 0.8
              });
              layer.isHighlighted = true;
            }
          });
        }
      }).addTo(this.map);
    },

    checkCoords(lat, lng) { // Method to check if coordinates are inside the highlighted states
      this.customLat = lat.toFixed(6);
      this.customLng = lng.toFixed(6);

      const point = [lng, lat];
      let insideHighlightedState = false;
      let stateName = '';

      this.geojsonLayer.eachLayer((layer) => {
        if (layer.isHighlighted && booleanPointInPolygon(point, layer.toGeoJSON().geometry)) {
          insideHighlightedState = true;
          stateName = layer.feature.properties.name;
        }
      });

      setTimeout(() => {  
        if (insideHighlightedState) {
          alert(`The point is inside ${stateName}`);
        } else {
          alert('The point is outside of the highlighted states.');
        }
      }, 100);  

      this.updateMarker(lat, lng);
    },

    checkCustomCoords() { // Method to check coordinates entered manually
      this.checkCoords(parseFloat(this.customLat), parseFloat(this.customLng));
    },
    
    setCurrentLocation() { // Method to get and check user's current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.checkCoords(position.coords.latitude, position.coords.longitude);
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    },
    
    setRandomLocation() { // Method to generate random US-based coordinates and check them
      const randomLat = Math.random() * (49 - 24) + 24;
      const randomLng = Math.random() * (-66 + 125) - 125;
      this.checkCoords(randomLat, randomLng);
    },
    
    updateMarker(lat, lng) { // Method to update marker on the map based on coordinates
      if (this.marker) {
        this.map.removeLayer(this.marker);
      }
      this.marker = L.marker([lat, lng]).addTo(this.map);
    }
  }
};

</script>

<style scoped>
.coord-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}
.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}
#map {
  margin-bottom: 1in;
}
</style>
