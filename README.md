# Epa — El punto de encuentro de la UJAP

Aplicación móvil social para la comunidad de la Universidad José Antonio Páez (San Diego, Carabobo).

Epa sirve para que estudiantes y profesores de la UJAP se consigan y armen planes reales: partidos de fútbol, grupos de estudio, salidas a comer, torneos, proyectos. El corazón de la app son los **planes en el mapa** y los **grupos de interés**.

El acceso es exclusivo para la comunidad universitaria: la cuenta se verifica con el correo institucional `@ujap.edu.ve`.

---

## Stack

| Capa | Tecnología |
| --- | --- |
| Framework | React Native 0.81 + Expo SDK 54 |
| Lenguaje | TypeScript (modo `strict`) |
| Navegación | Expo Router (rutas basadas en archivos) |
| Estilos | NativeWind (Tailwind CSS para React Native) + tokens propios |
| Estado global | Zustand |
| Mapas | `react-native-maps` en móvil, `react-leaflet` en web |
| Gestos y animación | React Native Gesture Handler + Reanimated |

---

## Cómo correrlo

```bash
npm install
cp .env.example .env     # en Windows: copy .env.example .env
npm run web              # abre la app en el navegador
```

Para verla en el teléfono, instala **Expo Go** y corre:

```bash
npm start                # escanea el código QR con Expo Go
```

---

## Estructura del proyecto

```
app/                       Rutas (Expo Router: cada archivo es una pantalla)
├── _layout.tsx            Layout raíz: fuentes, sesión, tema, splash
├── index.tsx              Redirige según haya sesión o no
├── onboarding.tsx         Registro con verificación de correo UJAP
├── login.tsx              Inicio de sesión
├── (tabs)/                Las 5 pestañas principales
│   ├── mapa.tsx           Mapa de planes
│   ├── descubrir.tsx      Descubrir estudiantes
│   ├── grupos.tsx         Grupos y comunidades
│   ├── mensajes.tsx       Bandeja de chats
│   └── perfil.tsx         Perfil propio
├── plan/                  Crear plan y elegir ubicación en el mapa
├── group/                 Detalle de grupo y crear grupo
├── chat/                  Conversación y chat nuevo
├── connections.tsx        Solicitudes de conexión recibidas y enviadas
├── notificaciones.tsx     Bandeja unificada de novedades
└── profile/edit.tsx       Editar perfil

src/
├── components/
│   ├── ui/                8 componentes base reutilizables
│   ├── descubrir/         Tarjetas, swipe y filtros
│   ├── grupos/            Tarjeta y banner de grupo
│   ├── mapa/              Lienzo del mapa, pines y detalle de plan
│   ├── mensajes/          Fila de conversación
│   ├── onboarding/        Selector de "qué buscas"
│   ├── plan/              Selector de ubicación
│   └── navigation/        Barra inferior de pestañas
├── store/                 8 stores de Zustand
├── theme/                 Paleta de color y tokens de diseño
├── types/                 Interfaces TypeScript del dominio
├── lib/                   Cliente HTTP, mappers y almacenamiento seguro
└── utils/                 Utilidades pequeñas
```

---

## Sistema de diseño

Toda la identidad visual está centralizada en `src/theme/`:

- **Primario:** coral `#FF6F61` — el color de las acciones
- **Secundario:** morado `#6B5B95` — acento
- **Marca UJAP:** navy `#13233E` y dorado `#CCA04F` para las insignias de verificación
- **Tipografía:** Inter, en 4 pesos
- **Modo oscuro** completo, con preferencia guardada por usuario

Los 8 componentes base (`Button`, `Card`, `Chip`, `Avatar`, `Badge`, `Input`, `EmptyState`, `BottomNav`) se importan de `src/components/ui` y son la única forma de construir pantallas. Por eso la app se ve consistente.

---

## Equipo

| Integrante | Área |
| --- | --- |
| Giusseppe Marinelly | Estructura del proyecto, sistema de diseño y navegación |
| Alvaro Lugo | Pantalla Descubrir |
| Jose Mendes | Mapa de planes y creación de planes |
| Luis Chirivella | Mensajes, chat y conexiones |
| Gabriel Infante | Grupos y comunidades |
| Rafael Sanchez | Onboarding, login y perfil |

Universidad José Antonio Páez — San Diego, Carabobo, Venezuela.
