import { create } from 'zustand';

import { fakeDelay, findMockUser, mockConversations, mockCurrentUser, mockMessages } from '@/src/mocks';
import type { Conversation, Message } from '@/src/types';

// Store de chats del Avance 1. Todavía no hay backend ni base de datos, así
// que todo vive en memoria: se siembra con los datos de `@/src/mocks` y a
// partir de ahí las acciones del usuario (mandar mensajes, abrir chats
// nuevos) se aplican sobre el estado. Cuando exista el backend, solo cambia
// el cuerpo de estas acciones; la forma del store se mantiene igual.

type ConversationsState = {
  conversations: Conversation[];
  messagesByConversation: Record<string, Message[]>;
  loading: boolean;
  fetchConversations: (currentUserId: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  startDirectConversation: (userId: string, currentUserId: string) => Promise<Conversation>;
  createGroupConversation: (
    participantIds: string[],
    title: string,
    currentUserId: string
  ) => Promise<Conversation>;
  markRead: (conversationId: string) => Promise<void>;
};

// Contador propio porque dos mensajes seguidos pueden caer en el mismo
// milisegundo y las listas de React necesitan keys únicas.
let localIdCounter = 0;

function nextId(prefix: string): string {
  localIdCounter += 1;
  return `${prefix}-${Date.now()}-${localIdCounter}`;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  messagesByConversation: {},
  loading: false,

  // El parámetro `currentUserId` no se usa mientras los datos son mock (el
  // mock ya viene armado desde el punto de vista de quien tiene la sesión),
  // pero se mantiene en la firma porque el backend sí lo va a necesitar.
  fetchConversations: async (currentUserId) => {
    void currentUserId;
    set({ loading: true });
    await fakeDelay();
    // La pantalla de mensajes vuelve a llamar aquí cada pocos segundos. Si
    // recargáramos el mock en cada vuelta, se perderían los mensajes que el
    // usuario acaba de escribir, así que solo se siembra la primera vez.
    if (get().conversations.length > 0) {
      set({ loading: false });
      return;
    }
    set({ conversations: mockConversations, loading: false });
  },

  fetchMessages: async (conversationId) => {
    await fakeDelay(200);
    // Mismo motivo que arriba: el chat abierto reconsulta cada 3 segundos y
    // no debe pisar los mensajes que ya están en memoria.
    if (get().messagesByConversation[conversationId]) return;
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: mockMessages[conversationId] ?? [],
      },
    }));
  },

  sendMessage: async (conversationId, text) => {
    const message: Message = {
      id: nextId('m'),
      conversationId,
      senderId: mockCurrentUser.id,
      text,
      sentAt: new Date().toISOString(),
    };
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [...(state.messagesByConversation[conversationId] ?? []), message],
      },
      // El resumen de la lista de chats se actualiza en el mismo set para
      // que la pantalla de mensajes no quede mostrando el mensaje anterior.
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, lastMessageText: message.text, lastMessageAt: message.sentAt }
          : conversation
      ),
    }));
  },

  startDirectConversation: async (userId, currentUserId) => {
    await fakeDelay(200);
    // Si ya se había hablado con esa persona, se reutiliza el chat existente
    // en vez de abrir uno nuevo con el mismo contenido duplicado.
    const existing = get().conversations.find(
      (conversation) =>
        conversation.type === 'directa' && conversation.participantIds.includes(userId)
    );
    if (existing) return existing;

    const person = findMockUser(userId);
    const conversation: Conversation = {
      id: nextId('c'),
      type: 'directa',
      title: person?.name ?? 'Estudiante UJAP',
      avatarUrl: person?.photoUrl,
      online: person?.online ?? false,
      participantIds: [currentUserId, userId],
      unreadCount: 0,
    };
    set((state) => ({ conversations: [conversation, ...state.conversations] }));
    return conversation;
  },

  createGroupConversation: async (participantIds, title, currentUserId) => {
    await fakeDelay(200);
    const conversation: Conversation = {
      id: nextId('c'),
      type: 'grupo',
      title,
      // Quien crea el grupo también forma parte de él, y el Set evita que se
      // repita si ya venía en la selección.
      participantIds: Array.from(new Set([currentUserId, ...participantIds])),
      unreadCount: 0,
    };
    set((state) => ({ conversations: [conversation, ...state.conversations] }));
    return conversation;
  },

  markRead: async (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      ),
    }));
  },
}));
