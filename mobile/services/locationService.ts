import * as Location from 'expo-location';
import type { Coordinates } from '../types';

export async function checkForegroundPermission() {
  const current = await Location.getForegroundPermissionsAsync();
  return current.status === 'granted';
}

export async function requestForegroundPermission() {
  const current = await Location.getForegroundPermissionsAsync();
  if (current.status === 'granted') return true;
  if (current.status === 'undetermined' || current.canAskAgain) {
    const next = await Location.requestForegroundPermissionsAsync();
    return next.status === 'granted';
  }
  return false;
}

export async function getForegroundPermission() {
  return requestForegroundPermission();
}

export async function getCurrentCoordinates(): Promise<Coordinates> {
  const granted = await requestForegroundPermission();
  if (!granted) {
    throw new Error('LOCATION_PERMISSION');
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
  };
}
