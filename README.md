# TiendaFree Frontend

README tecnico del frontend de TiendaFree.

## 1. Objetivo del proyecto

Aplicacion web para:

- Gestionar autenticacion de usuarios.
- Administrar una tienda desde un dashboard privado.
- Publicar una tienda en una URL publica por slug.
- Renderizar la tienda publica usando plantillas configurables.

## 2. Stack tecnologico

- React 19 + TypeScript
- Vite 8
- React Router DOM
- TanStack React Query
- Zustand (estado de sesion)
- Axios (cliente HTTP)
- Tailwind CSS
- Vitest + Testing Library
- ESLint

Dependencias de UI relevantes:

- MUI (Material UI)
- Sonner (toasts)
- Lucide

## 3. Arquitectura general

El proyecto esta organizado por dominios funcionales en src/modules:

- auth: login, registro, recuperacion y cambio de password.
- dashboard: gestion de tienda, productos, pedidos y configuraciones.
- storefront: vistas publicas y landing/public store.
- templates: motor de plantillas para render del storefront.

Capas principales:

- Presentacion: componentes y paginas React.
- Estado local/global: hooks + Zustand.
- Estado de servidor: React Query.
- Integracion API: axios centralizado en src/api/ApiBase.ts.

## 4. Flujo de navegacion

Rutas principales:

- Publicas: /, /login, /register, /forgot-password, /reset-password, /verify-email.
- Privadas: /dashboard y /demo/:nombre.
- Tienda publica: /tienda/:slug.

Comportamiento:

- PublicRoutes redirige al dashboard si el usuario ya esta autenticado.
- PrivateRoutes valida la sesion y redirige al login cuando no hay sesion valida.

## 5. Sesion y autenticacion

Estado de autenticacion:

- Persistencia en localStorage con middleware persist de Zustand.
- Validacion de expiracion JWT al hidratar estado y de forma periodica.
- Verificacion periodica de sesion cada 60 segundos.

Cliente API:

- Interceptor request agrega Authorization Bearer token cuando existe.
- Interceptor response hace logout y redirecciona a /login ante 401 (excepto login).

## 6. Integracion con backend

La app consume una API REST. Endpoints agrupados por dominio:

- authApi: registro, login, solicitud y confirmacion de reset.
- shop.api: alta de tienda, actualizacion de tienda/tema, metodos de pago y entrega, about us, marquee.
- product.api: CRUD de productos, imagenes, variantes, importacion/exportacion.

Nota tecnica:

- Existen operaciones multipart/form-data para archivos (imagenes y excel).
- Existen operaciones JSON para updates parciales.

## 7. Plantillas de storefront

El renderer de tienda publica selecciona plantilla a partir de metadata de tienda.

Plantillas registradas actualmente:

- plantilla_accesorios
- plantilla_gorras
- plantilla_ropa
- plantilla_urban

El sistema resuelve alias y formatos distintos del backend para plantilla/template.

## 8. Variables de entorno

La base URL de API en runtime se obtiene de:

- VITE_API_BASE_URL

Si no se define, se usa fallback local:

- http://localhost:3000/api/v1

Archivo disponible en repo:

- .env.example

Observacion importante:

- .env.example usa VITE_API_URL, pero el codigo usa VITE_API_BASE_URL.
- Recomendado: alinear ambos nombres para evitar errores de configuracion.

Ejemplo recomendado de .env local:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## 9. Scripts de desarrollo

```bash
npm install
npm run dev
```

Scripts disponibles:

- npm run dev: servidor de desarrollo.
- npm run build: typecheck y build de produccion.
- npm run preview: previsualizar build.
- npm run lint: analisis estatico.
- npm run test: tests en modo verbose.
- npm run test:ui: interfaz de Vitest.
- npm run test:run: ejecucion unica de tests.
- npm run audit: auditoria de dependencias (high+).

## 10. Testing

Framework de pruebas:

- Vitest con entorno jsdom.
- Setup global en src/test/setup.ts.

Cobertura actual observada:

- Formularios de autenticacion (Login, Register, ForgotPassword, ChangePass).

Pendientes sugeridos:

- Tests de rutas privadas/publicas.
- Tests de hooks de React Query (mock de API).
- Tests de render de plantillas de storefront.

## 11. Estructura de carpetas (resumen)

```text
src/
  api/                # cliente axios y configuracion base
  components/         # componentes compartidos
  constants/          # rutas y constantes globales
  hooks/              # hooks compartidos
  modules/
    auth/             # autenticacion y sesion
    dashboard/        # panel privado y gestion de tienda
    storefront/       # vistas publicas
    templates/        # motor y plantillas de storefront
  routes/             # guards de rutas
  store/              # stores globales compartidos
  test/               # setup y utilidades de test
  types/              # tipados base
```

## 12. Lineamientos para contribucion tecnica

- Mantener la segmentacion por modulos funcionales.
- Centralizar acceso HTTP en capa api por dominio.
- Evitar logica de negocio en componentes de presentacion.
- Tipar requests/responses y evitar any en nuevas piezas.
- Agregar pruebas para nuevas reglas de negocio.

## 13. Seguridad y operacion

Existe un documento complementario en SECURITY.md con recomendaciones de:

- gestion de secrets
- hardening de autenticacion
- observabilidad
- plan de accion de seguridad

## 14. Recursos visuales para el repositorio

Si se desea mejorar la presentacion del README, insertar capturas en estos puntos:

- Insertar imagen: flujo de login y registro.
- Insertar imagen: vista principal del dashboard.
- Insertar imagen: vista de editor/gestion de tienda.
- Insertar imagen: ejemplo de tienda publica por slug.
- Insertar imagen: mapa de arquitectura (modulos y capas).

Sugerencia de carpeta para assets de documentacion:

- docs/images/

## 15. Estado actual

El proyecto se encuentra funcional sobre Vite + React + TypeScript, con:

- enrutado publico/privado
- sesion persistida con validacion de JWT
- integracion modular con API REST
- render de storefront por plantillas
- base inicial de pruebas unitarias en autenticacion
