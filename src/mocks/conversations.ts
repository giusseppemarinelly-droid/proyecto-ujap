import type { Conversation, Message } from '@/src/types';
import { findMockUser } from './users';

/** Una fecha de hace N minutos, para que los chats se vean recién usados. */
function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

const avatarOf = (userId: string) => findMockUser(userId)?.photoUrl;
const nameOf = (userId: string) => findMockUser(userId)?.name ?? 'Estudiante UJAP';
const onlineOf = (userId: string) => findMockUser(userId)?.online ?? false;

export const mockConversations: Conversation[] = [
  {
    id: 'c1',
    type: 'directa',
    title: nameOf('u2'),
    avatarUrl: avatarOf('u2'),
    online: onlineOf('u2'),
    participantIds: ['u1', 'u2'],
    unreadCount: 2,
    lastMessageText: 'Dale, nos vemos en la biblioteca entonces',
    lastMessageAt: minutesAgo(12),
  },
  {
    id: 'c2',
    type: 'directa',
    title: nameOf('u6'),
    avatarUrl: avatarOf('u6'),
    online: onlineOf('u6'),
    participantIds: ['u1', 'u6'],
    unreadCount: 0,
    lastMessageText: 'Te paso el repo ahorita',
    lastMessageAt: minutesAgo(180),
  },
  {
    id: 'c3',
    type: 'grupo',
    title: 'Equipo de Fútbol UJAP',
    participantIds: ['u3', 'u6', 'u10', 'u8'],
    unreadCount: 5,
    lastMessageText: 'Daniel: Confirmen los que van hoy',
    lastMessageAt: minutesAgo(45),
  },
  {
    id: 'c4',
    type: 'grupo',
    title: 'Club de Programación',
    participantIds: ['u1', 'u4', 'u6'],
    unreadCount: 0,
    lastMessageText: 'Andrés: Subí el diagrama al Drive',
    lastMessageAt: minutesAgo(1440),
  },
  {
    id: 'c5',
    type: 'plan',
    title: 'Fulbito en la cancha techada',
    participantIds: ['u3', 'u6', 'u10'],
    unreadCount: 1,
    lastMessageText: 'Rafael: Llevo el balón',
    lastMessageAt: minutesAgo(90),
  },
];

export const mockMessages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', conversationId: 'c1', senderId: 'u2', text: 'Epa, ¿vas a ir a la charla de mañana?', sentAt: minutesAgo(60) },
    { id: 'm2', conversationId: 'c1', senderId: 'u1', text: 'Sí vale, ¿a qué hora era?', sentAt: minutesAgo(45) },
    { id: 'm3', conversationId: 'c1', senderId: 'u2', text: 'A las 10 en el auditorio', sentAt: minutesAgo(30) },
    { id: 'm4', conversationId: 'c1', senderId: 'u2', text: 'Dale, nos vemos en la biblioteca entonces', sentAt: minutesAgo(12) },
  ],
  c2: [
    { id: 'm5', conversationId: 'c2', senderId: 'u1', text: '¿Terminaste la parte del login?', sentAt: minutesAgo(240) },
    { id: 'm6', conversationId: 'c2', senderId: 'u6', text: 'Casi, me falta la validación', sentAt: minutesAgo(200) },
    { id: 'm7', conversationId: 'c2', senderId: 'u6', text: 'Te paso el repo ahorita', sentAt: minutesAgo(180) },
  ],
  c3: [
    { id: 'm8', conversationId: 'c3', senderId: 'u10', text: 'Yo llevo el balón', sentAt: minutesAgo(120) },
    { id: 'm9', conversationId: 'c3', senderId: 'u6', text: 'Yo caigo apenas salga de clase', sentAt: minutesAgo(75) },
    { id: 'm10', conversationId: 'c3', senderId: 'u3', text: 'Confirmen los que van hoy', sentAt: minutesAgo(45) },
  ],
  c4: [
    { id: 'm11', conversationId: 'c4', senderId: 'u4', text: 'Subí el diagrama al Drive', sentAt: minutesAgo(1440) },
  ],
  c5: [
    { id: 'm12', conversationId: 'c5', senderId: 'u3', text: 'Cancha reservada de 5 a 7', sentAt: minutesAgo(150) },
    { id: 'm13', conversationId: 'c5', senderId: 'u10', text: 'Llevo el balón', sentAt: minutesAgo(90) },
  ],
};
