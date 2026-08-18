import { create } from 'zustand';

import { fakeDelay, mockCurrentUser, mockGroups, summaryOf } from '@/src/mocks';
import type { Group, GroupCategory } from '@/src/types';

// El Avance 1 se entrega sin backend ni base de datos: este store se alimenta
// de los datos mock en memoria. La forma del estado y las acciones son las
// mismas que tendrá con backend, así que las pantallas no cambian después.

type CreateGroupInput = {
  name: string;
  category: GroupCategory;
  description: string;
};

type GroupsState = {
  groups: Group[];
  loading: boolean;
  error: string | null;
  fetchGroups: () => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  createGroup: (data: CreateGroupInput) => Promise<Group>;
};

/**
 * Suma al usuario de la sesión al grupo. Hay que tocar `memberIds` y `members`
 * a la vez porque el contador de miembros sale del primero y la lista de
 * la pantalla de detalle del segundo.
 */
function addCurrentUser(group: Group): Group {
  if (group.memberIds.includes(mockCurrentUser.id)) return group;
  return {
    ...group,
    memberIds: [...group.memberIds, mockCurrentUser.id],
    members: [...(group.members ?? []), summaryOf(mockCurrentUser.id)],
  };
}

/** El inverso de `addCurrentUser`, para cuando alguien se sale del grupo. */
function removeCurrentUser(group: Group): Group {
  return {
    ...group,
    memberIds: group.memberIds.filter((id) => id !== mockCurrentUser.id),
    members: (group.members ?? []).filter((person) => person.id !== mockCurrentUser.id),
  };
}

export const useGroupsStore = create<GroupsState>((set, get) => ({
  groups: [],
  loading: false,
  error: null,

  fetchGroups: async () => {
    set({ loading: true, error: null });
    await fakeDelay();
    set({ groups: mockGroups, loading: false });
  },

  joinGroup: async (groupId) => {
    await fakeDelay(200);
    // Solo se reemplaza el grupo afectado, para no rearmar el resto del listado.
    set({ groups: get().groups.map((group) => (group.id === groupId ? addCurrentUser(group) : group)) });
  },

  leaveGroup: async (groupId) => {
    await fakeDelay(200);
    set({ groups: get().groups.map((group) => (group.id === groupId ? removeCurrentUser(group) : group)) });
  },

  createGroup: async (data) => {
    await fakeDelay();
    const group: Group = {
      // Sin base de datos que genere ids, la marca de tiempo alcanza para que
      // no choque con los ids del mock ni con otro grupo recién creado.
      id: `g${Date.now()}`,
      name: data.name,
      category: data.category,
      description: data.description,
      // El grupo destacado del banner lo decide la universidad, no el usuario.
      featured: false,
      // Quien crea el grupo entra como primer miembro.
      memberIds: [mockCurrentUser.id],
      members: [summaryOf(mockCurrentUser.id)],
    };
    // Al principio del arreglo para que se vea de una vez en el listado.
    set({ groups: [group, ...get().groups] });
    return group;
  },
}));
