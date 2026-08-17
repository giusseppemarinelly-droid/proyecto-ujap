import type { Interest, PersonSummary, User } from '@/src/types';

// Datos de ejemplo del Avance 1. Todavía no hay backend ni base de datos:
// la app se alimenta de aquí para que se pueda navegar y probar la interfaz
// completa. Cuando exista el backend, estos arreglos se reemplazan por
// llamadas HTTP y los stores no cambian de forma.

export const mockInterests: Interest[] = [
  { id: 'i1', label: 'Fútbol' },
  { id: 'i2', label: 'Programación' },
  { id: 'i3', label: 'Música' },
  { id: 'i4', label: 'Cine' },
  { id: 'i5', label: 'Emprendimiento' },
  { id: 'i6', label: 'Voleibol' },
  { id: 'i7', label: 'Robótica' },
  { id: 'i8', label: 'Fotografía' },
  { id: 'i9', label: 'Videojuegos' },
  { id: 'i10', label: 'Lectura' },
  { id: 'i11', label: 'Baloncesto' },
  { id: 'i12', label: 'Diseño' },
];

const photo = (n: number) => `https://i.pravatar.cc/400?img=${n}`;

export const mockCurrentUser: User = {
  id: 'u1',
  email: 'giusseppe.marinelly@ujap.edu.ve',
  name: 'Giusseppe Marinelly',
  age: 21,
  faculty: 'Ingeniería',
  career: 'Ingeniería en Computación',
  semester: 5,
  bio: 'Armando cosas con código. Si el plan es jugar fútbol o programar algo, cuenta conmigo.',
  photoUrl: photo(12),
  photos: [photo(12), photo(13)],
  verified: true,
  isOrganizer: true,
  interestIds: ['i2', 'i1', 'i9', 'i7'],
  lookingFor: ['proyectos', 'deportes', 'amistades'],
  online: true,
  mutualConnections: [],
  stats: { plansCreated: 4, attendances: 11 },
};

export const mockUsers: User[] = [
  {
    id: 'u2',
    email: 'valeria.rondon@ujap.edu.ve',
    name: 'Valeria Rondón',
    age: 20,
    faculty: 'Ciencias Económicas y Sociales',
    career: 'Comunicación Social',
    semester: 4,
    bio: 'Me la paso con la cámara encima. Busco gente para hacer un cortometraje.',
    photoUrl: photo(5),
    photos: [photo(5), photo(9)],
    verified: true,
    isOrganizer: false,
    interestIds: ['i8', 'i4', 'i3'],
    lookingFor: ['proyectos', 'amistades'],
    online: true,
    mutualConnections: [{ id: 'u4', name: 'Andrés Colmenares', photoUrl: photo(33), online: false }],
    stats: { plansCreated: 2, attendances: 7 },
  },
  {
    id: 'u3',
    email: 'daniel.perozo@ujap.edu.ve',
    name: 'Daniel Perozo',
    age: 22,
    faculty: 'Ingeniería',
    career: 'Ingeniería Industrial',
    semester: 5,
    bio: 'Fútbol los martes y jueves sin falta. El resto del tiempo, tesis.',
    photoUrl: photo(51),
    photos: [photo(51)],
    verified: true,
    isOrganizer: true,
    interestIds: ['i1', 'i11', 'i5'],
    lookingFor: ['deportes', 'estudio'],
    online: false,
    mutualConnections: [],
    stats: { plansCreated: 6, attendances: 15 },
  },
  {
    id: 'u4',
    email: 'andres.colmenares@ujap.edu.ve',
    name: 'Andrés Colmenares',
    age: 23,
    faculty: 'Ingeniería',
    career: 'Ingeniería Electrónica',
    semester: 5,
    bio: 'Armando un brazo robótico para el electivo. Se aceptan manos.',
    photoUrl: photo(33),
    photos: [photo(33), photo(60)],
    verified: true,
    isOrganizer: false,
    interestIds: ['i7', 'i2', 'i9'],
    lookingFor: ['proyectos', 'estudio'],
    online: false,
    mutualConnections: [{ id: 'u2', name: 'Valeria Rondón', photoUrl: photo(5), online: true }],
    stats: { plansCreated: 1, attendances: 5 },
  },
  {
    id: 'u5',
    email: 'gabriela.silva@ujap.edu.ve',
    name: 'Gabriela Silva',
    age: 19,
    faculty: 'Ciencias de la Salud',
    career: 'Fisioterapia',
    semester: 2,
    bio: 'Voleibol y café. Siempre estoy buscando con quién estudiar anatomía.',
    photoUrl: photo(45),
    photos: [photo(45), photo(20)],
    verified: true,
    isOrganizer: false,
    interestIds: ['i6', 'i10', 'i3'],
    lookingFor: ['estudio', 'deportes', 'amistades'],
    online: true,
    mutualConnections: [],
    stats: { plansCreated: 0, attendances: 3 },
  },
  {
    id: 'u6',
    email: 'luis.chirivella@ujap.edu.ve',
    name: 'Luis Chirivella',
    age: 21,
    faculty: 'Ingeniería',
    career: 'Ingeniería en Computación',
    semester: 5,
    bio: 'Backend y videojuegos. Si hay torneo de FIFA, avísame.',
    photoUrl: photo(68),
    photos: [photo(68)],
    verified: true,
    isOrganizer: false,
    interestIds: ['i2', 'i9', 'i1'],
    lookingFor: ['proyectos', 'eventos'],
    online: true,
    mutualConnections: [{ id: 'u3', name: 'Daniel Perozo', photoUrl: photo(51), online: false }],
    stats: { plansCreated: 3, attendances: 9 },
  },
  {
    id: 'u7',
    email: 'maria.escalona@ujap.edu.ve',
    name: 'María Escalona',
    age: 20,
    faculty: 'Ciencias Jurídicas y Políticas',
    career: 'Derecho',
    semester: 3,
    bio: 'Debate, lectura y mucho café. Busco grupo de estudio serio.',
    photoUrl: photo(16),
    photos: [photo(16), photo(24)],
    verified: true,
    isOrganizer: false,
    interestIds: ['i10', 'i5', 'i4'],
    lookingFor: ['estudio', 'proyectos'],
    online: false,
    mutualConnections: [],
    stats: { plansCreated: 1, attendances: 6 },
  },
  {
    id: 'u8',
    email: 'jose.mendes@ujap.edu.ve',
    name: 'José Mendes',
    age: 22,
    faculty: 'Ingeniería',
    career: 'Ingeniería en Telecomunicaciones',
    semester: 4,
    bio: 'Toco guitarra en la banda de la universidad. Ensayamos los viernes.',
    photoUrl: photo(59),
    photos: [photo(59)],
    verified: true,
    isOrganizer: true,
    interestIds: ['i3', 'i2', 'i8'],
    lookingFor: ['eventos', 'amistades'],
    online: true,
    mutualConnections: [],
    stats: { plansCreated: 5, attendances: 12 },
  },
  {
    id: 'u9',
    email: 'andrea.bracho@ujap.edu.ve',
    name: 'Andrea Bracho',
    age: 21,
    faculty: 'Ciencias Económicas y Sociales',
    career: 'Administración de Empresas',
    semester: 4,
    bio: 'Tengo una idea de negocio y me falta el equipo. Hablemos.',
    photoUrl: photo(31),
    photos: [photo(31), photo(47)],
    verified: true,
    isOrganizer: false,
    interestIds: ['i5', 'i12', 'i10'],
    lookingFor: ['proyectos', 'amistades'],
    online: false,
    mutualConnections: [{ id: 'u5', name: 'Gabriela Silva', photoUrl: photo(45), online: true }],
    stats: { plansCreated: 2, attendances: 4 },
  },
  {
    id: 'u10',
    email: 'rafael.sanchez@ujap.edu.ve',
    name: 'Rafael Sánchez',
    age: 23,
    faculty: 'Ingeniería',
    career: 'Ingeniería Mecánica',
    semester: 5,
    bio: 'Baloncesto y carros. Los domingos hay pichanga en la cancha techada.',
    photoUrl: photo(65),
    photos: [photo(65)],
    verified: true,
    isOrganizer: false,
    interestIds: ['i11', 'i1', 'i9'],
    lookingFor: ['deportes', 'eventos'],
    online: true,
    mutualConnections: [],
    stats: { plansCreated: 2, attendances: 8 },
  },
];

/** Todos los usuarios del mock, incluido el que tiene la sesión abierta. */
export const allMockUsers: User[] = [mockCurrentUser, ...mockUsers];

/** Convierte un usuario completo en el resumen que muestran los avatares. */
export function toPersonSummary(user: User): PersonSummary {
  return { id: user.id, name: user.name, photoUrl: user.photoUrl, online: user.online };
}

/** Busca un usuario por id dentro del mock. */
export function findMockUser(id: string): User | undefined {
  return allMockUsers.find((user) => user.id === id);
}

/** El resumen de una persona a partir de su id, para armar listas de asistentes. */
export function summaryOf(id: string): PersonSummary {
  const user = findMockUser(id);
  return user
    ? toPersonSummary(user)
    : { id, name: 'Estudiante UJAP', photoUrl: undefined, online: false };
}
