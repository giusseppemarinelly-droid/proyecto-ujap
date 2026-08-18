// Store de la pila de Descubrir. En el Avance 1 no hay backend ni base de
// datos: los candidatos salen de los datos de ejemplo de `@/src/mocks` y la
// pila vive en memoria, así que al reiniciar la app vuelve a estar completa.

import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { create } from 'zustand';

import { fakeDelay, mockUsers } from '@/src/mocks';
import type { User } from '@/src/types';

type DiscoverAction = 'descartado' | 'conectado';

type DiscoverState = {
  usersById: Record<string, User>;
  queue: string[];
  loading: boolean;
  history: { userId: string; action: DiscoverAction }[];
  fetchCandidates: () => Promise<void>;
  descartar: (userId: string) => void;
  conectar: (userId: string) => void;
  deshacer: () => void;
};

function removeFromQueue(action: DiscoverAction) {
  return (userId: string) =>
    (state: DiscoverState): Partial<DiscoverState> => ({
      queue: state.queue.filter((id) => id !== userId),
      history: [...state.history, { userId, action }],
    });
}

export const useDiscoverStore = create<DiscoverState>((set) => ({
  usersById: {},
  queue: [],
  loading: false,
  history: [],

  // `mockUsers` ya viene sin el usuario de la sesión, así que nadie se ve a sí
  // mismo en la pila. Los filtros de facultad, carrera, semestre e intereses se
  // aplican en la pantalla sobre esta cola, no aquí.
  fetchCandidates: async () => {
    set({ loading: true });
    await fakeDelay();
    set({
      usersById: Object.fromEntries(mockUsers.map((user) => [user.id, user])),
      queue: mockUsers.map((user) => user.id),
      loading: false,
    });
  },

  descartar: (userId) => set(removeFromQueue('descartado')(userId)),

  conectar: (userId) => {
    set(removeFromQueue('conectado')(userId));
    // Pequeño golpe táctil al mandar el epa, tanto por botón como por swipe.
    // En nativo usa el motor de haptics del teléfono; en web (la PWA) recurre
    // a la Vibration API, que Android soporta pero iOS Safari no implementa en
    // absoluto (ni instalada como PWA) — eso es una restricción de Apple, no
    // hay forma de sortearla desde el navegador.
    if (Platform.OS === 'web') {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(30);
      }
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
  },

  deshacer: () =>
    set((state) => {
      const last = state.history[state.history.length - 1];
      if (!last) return state;
      return {
        queue: [last.userId, ...state.queue],
        history: state.history.slice(0, -1),
      };
    }),
}));
