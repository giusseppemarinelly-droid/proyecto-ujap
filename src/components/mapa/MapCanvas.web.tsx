import { Suspense, lazy, useEffect, useState } from 'react';
import { View } from 'react-native';

import { colors } from '@/src/theme/tokens';
import type { Plan } from '@/src/types';

// Leaflet lee `window` apenas se evalúa el módulo, y con
// `web.output: "static"` Expo Router renderiza las rutas en Node primero.
// Por eso el mapa real vive en un módulo aparte que sólo se importa (de
// forma diferida) una vez que ya estamos montados en el navegador.
const MapCanvasLeaflet = lazy(() =>
  import('./MapCanvasLeaflet').then((mod) => ({ default: mod.MapCanvasLeaflet }))
);

type MapCanvasProps = {
  plans: Plan[];
  selectedPlanId: string | null;
  onSelectPlan: (id: string) => void;
};

function MapPlaceholder() {
  return <View style={{ flex: 1, backgroundColor: colors['surface-container'] }} />;
}

export function MapCanvas(props: MapCanvasProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  if (!isClient) return <MapPlaceholder />;

  return (
    <Suspense fallback={<MapPlaceholder />}>
      <MapCanvasLeaflet {...props} />
    </Suspense>
  );
}
