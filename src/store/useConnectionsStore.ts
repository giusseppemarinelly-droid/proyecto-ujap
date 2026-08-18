import { create } from 'zustand';

import { fakeDelay, mockCurrentUser, mockIncomingRequests, mockSentRequests } from '@/src/mocks';
import type { User } from '@/src/types';
import { useConversationsStore } from './useConversationsStore';

// Bandeja de "epas" del Avance 1. Sin backend todavía: se siembra con los
// datos de `@/src/mocks` y las respuestas del usuario se resuelven en
// memoria. Los tipos se siguen declarando aquí porque son la API pública que
// consumen las pantallas de conexiones y notificaciones.

export type ConnectionStatus = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';

export type IncomingRequest = {
  id: string;
  createdAt: string;
  requester: User;
};

export type SentRequest = {
  id: string;
  status: ConnectionStatus;
  createdAt: string;
  receiver: User;
};

type ConnectionsState = {
  incoming: IncomingRequest[];
  sent: SentRequest[];
  loading: boolean;
  responding: Record<string, boolean>;
  fetchAll: () => Promise<void>;
  respond: (connectionId: string, accept: boolean) => Promise<{ conversationId: string | null }>;
};

// Marca si ya se sembró el mock. No basta con mirar si los arreglos están
// vacíos: si el usuario responde las dos solicitudes recibidas, `incoming`
// vuelve a quedar en cero y el polling las traería de vuelta.
let seeded = false;

export const useConnectionsStore = create<ConnectionsState>((set, get) => ({
  incoming: [],
  sent: [],
  loading: false,
  responding: {},

  fetchAll: async () => {
    set({ loading: true });
    await fakeDelay();
    // Las pantallas reconsultan cada 8 segundos; solo la primera llamada
    // carga datos, el resto se limita a apagar el spinner.
    if (seeded) {
      set({ loading: false });
      return;
    }
    seeded = true;
    set({ incoming: mockIncomingRequests, sent: mockSentRequests, loading: false });
  },

  respond: async (connectionId, accept) => {
    set((state) => ({ responding: { ...state.responding, [connectionId]: true } }));
    // Se busca antes de filtrar: al aceptar hace falta saber con quién se abre
    // el chat, y un instante después la solicitud ya no está en la bandeja.
    const request = get().incoming.find((item) => item.id === connectionId);
    await fakeDelay(300);
    set((state) => ({
      incoming: state.incoming.filter((item) => item.id !== connectionId),
      responding: { ...state.responding, [connectionId]: false },
    }));

    if (!accept || !request) return { conversationId: null };

    // Aceptar un epa abre la conversación de verdad, no un id inventado: así
    // la pantalla de connections navega a un chat que existe y aparece en la
    // bandeja de mensajes.
    const conversation = await useConversationsStore
      .getState()
      .startDirectConversation(request.requester.id, mockCurrentUser.id);

    return { conversationId: conversation.id };
  },
}));
