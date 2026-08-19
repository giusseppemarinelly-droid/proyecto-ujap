import { Suspense, lazy, useEffect, useState } from 'react';
import { View } from 'react-native';

import { colors } from '@/src/theme/tokens';

// Mismo motivo que en MapCanvas.web: Leaflet no puede evaluarse durante el
// render estático en Node, así que se carga recién en el cliente.
const LocationPickerLeaflet = lazy(() =>
  import('./LocationPickerLeaflet').then((mod) => ({ default: mod.LocationPickerLeaflet }))
);

type LocationPickerProps = {
  initialLat: number;
  initialLng: number;
  flyTo: { lat: number; lng: number } | null;
  onRegionChange: (lat: number, lng: number) => void;
};

function MapPlaceholder() {
  return <View style={{ flex: 1, backgroundColor: colors['surface-container'] }} />;
}

export function LocationPicker(props: LocationPickerProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  if (!isClient) return <MapPlaceholder />;

  return (
    <Suspense fallback={<MapPlaceholder />}>
      <LocationPickerLeaflet {...props} />
    </Suspense>
  );
}
