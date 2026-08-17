import type { User } from '@/src/types';
import { findMockUser } from './users';

// Estos tipos se declaran aquí para que el mock no dependa del store. El
// store de conexiones exporta los suyos con la misma forma, y TypeScript los
// acepta porque compara por estructura, no por nombre.
export type MockConnectionStatus = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';

export type MockIncomingRequest = {
  id: string;
  createdAt: string;
  requester: User;
};

export type MockSentRequest = {
  id: string;
  status: MockConnectionStatus;
  createdAt: string;
  receiver: User;
};

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3_600_000).toISOString();
}

const user = (id: string) => findMockUser(id) as User;

export const mockIncomingRequests: MockIncomingRequest[] = [
  { id: 'cn1', createdAt: hoursAgo(2), requester: user('u5') },
  { id: 'cn2', createdAt: hoursAgo(26), requester: user('u9') },
];

export const mockSentRequests: MockSentRequest[] = [
  { id: 'cn3', status: 'PENDIENTE', createdAt: hoursAgo(5), receiver: user('u7') },
  { id: 'cn4', status: 'ACEPTADA', createdAt: hoursAgo(50), receiver: user('u6') },
];
