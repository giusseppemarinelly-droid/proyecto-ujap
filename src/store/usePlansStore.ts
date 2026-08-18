import { create } from 'zustand';

import { fakeDelay, mockCurrentUser, mockPlans, summaryOf } from '@/src/mocks';
import type { Plan, PlanCategory } from '@/src/types';

// El Avance 1 se entrega sin backend ni base de datos: este store se alimenta
// de los datos mock en memoria. La forma del estado y las acciones son las
// mismas que tendrá con backend, así que las pantallas no cambian después.

type CreatePlanInput = {
  title: string;
  description: string;
  category: PlanCategory;
  latitude: number;
  longitude: number;
  address: string;
  dateTime: string;
  capacity: number;
};

type PlansState = {
  plans: Plan[];
  loading: boolean;
  error: string | null;
  fetchPlans: () => Promise<void>;
  joinPlan: (planId: string) => Promise<void>;
  leavePlan: (planId: string) => Promise<void>;
  createPlan: (data: CreatePlanInput) => Promise<Plan>;
};

/**
 * Suma al usuario de la sesión a la lista de asistentes. Hay que tocar
 * `attendeeIds` y `attendees` a la vez porque la tarjeta del plan usa el
 * primero para el contador y el segundo para los avatares.
 */
function addCurrentUser(plan: Plan): Plan {
  if (plan.attendeeIds.includes(mockCurrentUser.id)) return plan;
  return {
    ...plan,
    attendeeIds: [...plan.attendeeIds, mockCurrentUser.id],
    attendees: [...(plan.attendees ?? []), summaryOf(mockCurrentUser.id)],
  };
}

/** El inverso de `addCurrentUser`, para cuando alguien se baja del plan. */
function removeCurrentUser(plan: Plan): Plan {
  return {
    ...plan,
    attendeeIds: plan.attendeeIds.filter((id) => id !== mockCurrentUser.id),
    attendees: (plan.attendees ?? []).filter((person) => person.id !== mockCurrentUser.id),
  };
}

export const usePlansStore = create<PlansState>((set, get) => ({
  plans: [],
  loading: false,
  error: null,

  fetchPlans: async () => {
    set({ loading: true, error: null });
    await fakeDelay();
    set({ plans: mockPlans, loading: false });
  },

  joinPlan: async (planId) => {
    await fakeDelay(200);
    // Solo se reemplaza el plan afectado: así el resto del arreglo conserva su
    // referencia y la lista del mapa no se vuelve a dibujar entera.
    set({ plans: get().plans.map((plan) => (plan.id === planId ? addCurrentUser(plan) : plan)) });
  },

  leavePlan: async (planId) => {
    await fakeDelay(200);
    set({ plans: get().plans.map((plan) => (plan.id === planId ? removeCurrentUser(plan) : plan)) });
  },

  createPlan: async (data) => {
    await fakeDelay();
    const plan: Plan = {
      // Sin base de datos que genere ids, la marca de tiempo alcanza para que
      // no choque con los ids del mock ni con otro plan recién creado.
      id: `p${Date.now()}`,
      creatorId: mockCurrentUser.id,
      creator: summaryOf(mockCurrentUser.id),
      title: data.title,
      description: data.description,
      category: data.category,
      location: {
        lat: data.latitude,
        lng: data.longitude,
        address: data.address,
      },
      dateTime: data.dateTime,
      capacity: data.capacity,
      status: 'programado',
      isPublic: true,
      // Quien arma el plan ya cuenta como asistente.
      attendeeIds: [mockCurrentUser.id],
      attendees: [summaryOf(mockCurrentUser.id)],
    };
    // Al principio del arreglo para que aparezca de una vez en el mapa.
    set({ plans: [plan, ...get().plans] });
    return plan;
  },
}));
