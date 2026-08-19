// Store de sesión y perfil. En el Avance 1 no hay backend ni base de datos:
// todo sale de los datos de ejemplo de `@/src/mocks` y vive en memoria, así
// que los cambios duran lo que dure la app abierta. La forma del store es la
// misma que tendrá con backend, para que las pantallas no se toquen después.

import { create } from 'zustand';

import { fakeDelay, mockCurrentUser, mockInterests } from '@/src/mocks';
import type { Faculty, Interest, LookingFor, User } from '@/src/types';

type OnboardingDraft = {
  name: string;
  email: string;
  password: string;
  faculty?: Faculty;
  career?: string;
  semester?: number;
  bio: string;
  interestIds: string[];
  lookingFor: LookingFor[];
};

type AuthStatus = 'checking' | 'signed-out' | 'signed-in';

type AuthState = {
  status: AuthStatus;
  currentUser: User | null;
  draft: OnboardingDraft;
  interests: Interest[];
  error: string | null;

  restoreSession: () => Promise<void>;
  loadInterests: () => Promise<void>;
  setDraftField: <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => void;
  toggleInterest: (interestId: string) => void;
  toggleLookingFor: (value: LookingFor) => void;
  completeOnboarding: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    bio?: string;
    career?: string;
    faculty?: Faculty;
    semester?: number;
    age?: number;
    photoUrl?: string;
    interestIds?: string[];
    lookingFor?: LookingFor[];
  }) => Promise<void>;
  uploadPhoto: (imageBase64: string, mimeType: string) => Promise<void>;
  addGalleryPhoto: (imageBase64: string, mimeType: string) => Promise<void>;
  removeGalleryPhoto: (photoUrl: string) => Promise<void>;
  sendHeartbeat: () => Promise<void>;
};

const emptyDraft: OnboardingDraft = {
  name: '',
  email: '',
  password: '',
  bio: '',
  interestIds: [],
  lookingFor: [],
};

const EMAIL_DOMAIN = '@ujap.edu.ve';
const MIN_PASSWORD_LENGTH = 8;

// Las dos reglas que la app sí puede verificar sin servidor: que el correo sea
// institucional (es lo que define quién entra a Epa) y que la contraseña tenga
// un largo mínimo. Se comparten entre el registro y el inicio de sesión para
// que los dos formularios den exactamente el mismo mensaje de error.
function assertValidCredentials(email: string, password: string) {
  if (!email.trim().toLowerCase().endsWith(EMAIL_DOMAIN)) {
    throw new Error('Usa tu correo institucional @ujap.edu.ve');
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error('La contraseña debe tener al menos 8 caracteres');
  }
}

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

// Sin servidor donde subir la imagen, la propia cadena base64 hace de URL.
// React Native muestra un `data:` URI igual que cualquier http, así que la
// foto que el usuario escoge de su galería se ve de una vez en el perfil.
function toDataUrl(imageBase64: string, mimeType: string) {
  return `data:${mimeType};base64,${imageBase64}`;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'checking',
  currentUser: null,
  draft: emptyDraft,
  interests: [],
  error: null,

  // No hay sesión persistida: la app siempre arranca cerrada para poder
  // demostrar el onboarding completo en cada corrida.
  restoreSession: async () => {
    set({ status: 'signed-out', currentUser: null });
  },

  loadInterests: async () => {
    await fakeDelay();
    set({ interests: mockInterests });
  },

  setDraftField: (key, value) => set((state) => ({ draft: { ...state.draft, [key]: value } })),

  toggleInterest: (interestId) =>
    set((state) => {
      const isSelected = state.draft.interestIds.includes(interestId);
      return {
        draft: {
          ...state.draft,
          interestIds: isSelected
            ? state.draft.interestIds.filter((id) => id !== interestId)
            : [...state.draft.interestIds, interestId],
        },
      };
    }),

  toggleLookingFor: (value) =>
    set((state) => {
      const isSelected = state.draft.lookingFor.includes(value);
      return {
        draft: {
          ...state.draft,
          lookingFor: isSelected
            ? state.draft.lookingFor.filter((item) => item !== value)
            : [...state.draft.lookingFor, value],
        },
      };
    }),

  // Arma el usuario de la sesión con lo que se llenó en el formulario. El
  // perfil nace vacío de actividad (sin planes ni asistencias) para que se
  // note la diferencia con un perfil ya usado.
  completeOnboarding: async () => {
    const draft = get().draft;
    set({ error: null });

    try {
      assertValidCredentials(draft.email, draft.password);
      if (!draft.name.trim() || !draft.faculty || !draft.career?.trim() || !draft.semester) {
        throw new Error('Completa tu perfil académico para continuar');
      }

      await fakeDelay();

      const user: User = {
        id: 'u1',
        email: draft.email.trim().toLowerCase(),
        name: draft.name.trim(),
        // El formulario de onboarding no pide la edad, así que se hereda la
        // del usuario de ejemplo y se puede corregir desde "Editar perfil".
        age: mockCurrentUser.age,
        faculty: draft.faculty,
        career: draft.career.trim(),
        semester: draft.semester,
        bio: draft.bio.trim(),
        photoUrl: undefined,
        photos: [],
        verified: true,
        isOrganizer: false,
        interestIds: draft.interestIds,
        lookingFor: draft.lookingFor,
        online: true,
        mutualConnections: [],
        stats: { plansCreated: 0, attendances: 0 },
      };

      set({ currentUser: user, status: 'signed-in', draft: emptyDraft });
    } catch (err) {
      set({ error: errorMessage(err, 'No se pudo completar el registro') });
      throw err;
    }
  },

  // Maqueta: cualquier correo institucional con una contraseña de largo válido
  // entra, y lo hace como el usuario de ejemplo pero conservando el correo
  // escrito, para que la demo se sienta propia de quien la está probando.
  login: async (email, password) => {
    set({ error: null });
    try {
      assertValidCredentials(email, password);
      await fakeDelay();
      set({
        currentUser: { ...mockCurrentUser, email: email.trim().toLowerCase() },
        status: 'signed-in',
      });
    } catch (err) {
      set({ error: errorMessage(err, 'No se pudo iniciar sesión') });
      throw err;
    }
  },

  logout: async () => {
    set({ currentUser: null, status: 'signed-out', draft: emptyDraft });
  },

  // Solo pisa los campos que vengan definidos: la pantalla de edición manda un
  // subconjunto y lo demás del perfil tiene que sobrevivir intacto.
  updateProfile: async (data) => {
    await fakeDelay(200);
    set((state) => {
      const user = state.currentUser;
      if (!user) return state;
      return {
        currentUser: {
          ...user,
          name: data.name ?? user.name,
          bio: data.bio ?? user.bio,
          career: data.career ?? user.career,
          faculty: data.faculty ?? user.faculty,
          semester: data.semester ?? user.semester,
          age: data.age ?? user.age,
          photoUrl: data.photoUrl ?? user.photoUrl,
          interestIds: data.interestIds ?? user.interestIds,
          lookingFor: data.lookingFor ?? user.lookingFor,
        },
      };
    });
  },

  uploadPhoto: async (imageBase64, mimeType) => {
    await fakeDelay(300);
    set((state) => {
      const user = state.currentUser;
      if (!user) return state;
      return { currentUser: { ...user, photoUrl: toDataUrl(imageBase64, mimeType) } };
    });
  },

  addGalleryPhoto: async (imageBase64, mimeType) => {
    await fakeDelay(300);
    set((state) => {
      const user = state.currentUser;
      if (!user) return state;
      const photoUrl = toDataUrl(imageBase64, mimeType);
      return {
        currentUser: {
          ...user,
          photos: [...user.photos, photoUrl],
          // Quien se acaba de registrar no tiene foto principal; la primera
          // que agrega a la galería pasa a serlo, como dice la propia pantalla.
          photoUrl: user.photoUrl ?? photoUrl,
        },
      };
    });
  },

  removeGalleryPhoto: async (photoUrl) => {
    await fakeDelay(200);
    set((state) => {
      const user = state.currentUser;
      if (!user) return state;
      const photos = user.photos.filter((item) => item !== photoUrl);
      return {
        currentUser: {
          ...user,
          photos,
          // Si se borró justo la foto principal, asciende la siguiente para no
          // dejar el avatar apuntando a una imagen que ya no está.
          photoUrl: user.photoUrl === photoUrl ? photos[0] : user.photoUrl,
        },
      };
    });
  },

  // El estado "en línea" lo derivaría el backend de esta marca de tiempo. Sin
  // servidor no hay a quién avisarle, pero el layout raíz la sigue llamando en
  // un intervalo, así que se queda como no-op en vez de desaparecer.
  sendHeartbeat: async () => {},
}));
