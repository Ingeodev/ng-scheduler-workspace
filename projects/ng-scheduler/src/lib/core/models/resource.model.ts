export interface ResourceModel {
  id: string,
  name: string,

  // -- Visual & UI --
  color?: string,       // Color base para el recurso (borde/fondo)
  avatar?: string,      // URL de imagen o iniciales
  description?: string,
  tags?: string[],      // Etiquetas para filtrado

  // -- Control & Lógica --
  isActive?: boolean,   // Si true, el recurso está activo y visible. Defecto: true
  isReadOnly?: boolean, // Si true, no se pueden editar sus eventos
  isBlocked?: boolean,  // Si true, no acepta nuevos eventos
  metadata?: any,       // Datos flexibles del usuario
}