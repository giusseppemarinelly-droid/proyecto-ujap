import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Leaflet mide su contenedor una sola vez, al inicializarse. Como el mapa se
// monta de forma diferida (recién en el cliente) y vive dentro de layouts flex
// de react-native-web, ese primer cálculo puede caer cuando el div todavía
// tiene alto 0: el resultado son tiles grises o cargadas a medias. Observamos
// el tamaño real del contenedor y le avisamos a Leaflet cada vez que cambia.
export function MapAutoResize() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    map.invalidateSize();

    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}
