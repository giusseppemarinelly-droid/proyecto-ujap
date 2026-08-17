// Barril de los datos de ejemplo del Avance 1. Todos los stores leen de aquí
// mientras el proyecto no tenga backend.

export {
  mockInterests,
  mockCurrentUser,
  mockUsers,
  allMockUsers,
  toPersonSummary,
  findMockUser,
  summaryOf,
} from './users';

export { mockPlans, UJAP_LAT, UJAP_LNG } from './plans';

export { mockGroups } from './groups';

export { mockConversations, mockMessages } from './conversations';

export {
  mockIncomingRequests,
  mockSentRequests,
  type MockConnectionStatus,
  type MockIncomingRequest,
  type MockSentRequest,
} from './connections';

/** Simula la demora de una petición de red, para que se vean los spinners. */
export function fakeDelay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
