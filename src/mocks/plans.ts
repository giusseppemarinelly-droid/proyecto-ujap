import type { Plan } from '@/src/types';
import { summaryOf } from './users';

// Coordenadas del campus de la UJAP en San Diego, Carabobo. Los planes del
// mock se reparten alrededor para que el mapa no se vea vacío.
export const UJAP_LAT = 10.2167;
export const UJAP_LNG = -68.0092;

/**
 * Devuelve una fecha relativa a hoy, para que los planes del mock siempre
 * queden en el futuro cercano sin importar cuándo se abra la app.
 */
function at(hour: number, addDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + addDays);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export const mockPlans: Plan[] = [
  {
    id: 'p1',
    creatorId: 'u3',
    creator: summaryOf('u3'),
    title: 'Fulbito en la cancha techada',
    description: 'Nos faltan dos para completar los equipos. Traigan agua.',
    category: 'deportes',
    location: { lat: UJAP_LAT + 0.0012, lng: UJAP_LNG - 0.0009, address: 'Cancha techada, UJAP' },
    dateTime: at(17),
    capacity: 12,
    status: 'programado',
    isPublic: true,
    attendeeIds: ['u3', 'u6', 'u10'],
    attendees: ['u3', 'u6', 'u10'].map(summaryOf),
  },
  {
    id: 'p2',
    creatorId: 'u7',
    creator: summaryOf('u7'),
    title: 'Estudiar para el parcial de Civil',
    description: 'Biblioteca, piso 2. Llevo los resúmenes del tema 4.',
    category: 'estudio',
    location: { lat: UJAP_LAT - 0.0008, lng: UJAP_LNG + 0.0011, address: 'Biblioteca central, UJAP' },
    dateTime: at(14, 1),
    capacity: 6,
    status: 'programado',
    isPublic: true,
    attendeeIds: ['u7', 'u5'],
    attendees: ['u7', 'u5'].map(summaryOf),
  },
  {
    id: 'p3',
    creatorId: 'u8',
    creator: summaryOf('u8'),
    title: 'Ensayo de la banda',
    description: 'Repasamos el repertorio para el acto de la semana que viene.',
    category: 'cultura',
    location: { lat: UJAP_LAT + 0.0005, lng: UJAP_LNG + 0.0016, address: 'Auditorio, UJAP' },
    dateTime: at(16, 2),
    capacity: 10,
    status: 'programado',
    isPublic: true,
    attendeeIds: ['u8', 'u2'],
    attendees: ['u8', 'u2'].map(summaryOf),
  },
  {
    id: 'p4',
    creatorId: 'u9',
    creator: summaryOf('u9'),
    title: 'Almuerzo en la feria',
    description: 'Salimos apenas termine la clase de las 11. El que llegue tarde paga.',
    category: 'comida',
    location: { lat: UJAP_LAT - 0.0021, lng: UJAP_LNG - 0.0018, address: 'Feria de comida, San Diego' },
    dateTime: at(12),
    capacity: 8,
    status: 'en_curso',
    isPublic: true,
    attendeeIds: ['u9', 'u5', 'u2', 'u7'],
    attendees: ['u9', 'u5', 'u2', 'u7'].map(summaryOf),
  },
  {
    id: 'p5',
    creatorId: 'u4',
    creator: summaryOf('u4'),
    title: 'Avance del brazo robótico',
    description: 'Toca soldar la placa. Si sabes de electrónica, caes bien.',
    category: 'proyectos',
    location: { lat: UJAP_LAT + 0.0019, lng: UJAP_LNG + 0.0004, address: 'Laboratorio de Electrónica, UJAP' },
    dateTime: at(15, 3),
    capacity: 5,
    status: 'programado',
    isPublic: true,
    attendeeIds: ['u4'],
    attendees: ['u4'].map(summaryOf),
  },
];
