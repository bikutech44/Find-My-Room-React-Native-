import * as Location from 'expo-location';

class LocationManager {
  constructor() {
    if (LocationManager.instance) {
      return LocationManager.instance;
    }
    LocationManager.instance = this;
    this.userLocation = null;
    this.locationError = null;
  }

  async requestAndGetLocation() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        this.userLocation = location.coords;
        this.locationError = null;
      } else {
        this.userLocation = { unavailable: true };
        this.locationError = "Location permission denied. Using default location.";
      }
    } catch (err) {
      console.warn("Error getting location:", err);
      this.locationError = "Error getting location.";
    }
    return {
      location: this.userLocation,
      error: this.locationError
    };
  }

  getLocation() {
    return {
      location: this.userLocation,
      error: this.locationError
    };
  }

  clearLocation() {
    this.userLocation = null;
    this.locationError = null;
  }
}

const locationManager = new LocationManager();
export default locationManager;