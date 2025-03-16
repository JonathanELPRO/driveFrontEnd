import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'login', // Ruta para la pantalla de login
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register', // Ruta para la pantalla de registro
    renderMode: RenderMode.Prerender
  },
  {
    path: 'documents', // Ruta para la pantalla de carga de documentos
    renderMode: RenderMode.Prerender
  },
  {
    path: '**', // Ruta comodín para todas las demás rutas no especificadas
    renderMode: RenderMode.Prerender
  }
];
