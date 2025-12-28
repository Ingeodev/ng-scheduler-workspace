> [!WARNING]
> This package is currently under development and is not yet finished. It is **not recommended for production use**.
>
> If you need more information or have any questions, please contact:
> - **miguelonCoder**: mr.develop411@gmail.com
> - **Ingeodev**: ingeodev@gmail.com

# ng-scheduler Playground & Documentation Site

Este proyecto `playground` ha sido transformado en un sitio de documentación completo para la librería `ng-scheduler`, siguiendo el estilo y filosofía de la documentación oficial de Angular y Angular Material.

## 📋 Tabla de Contenidos

- [Estructura del Proyecto](#estructura-del-proyecto)
- [Arquitectura](#arquitectura)
- [Diseño y Estilo](#diseño-y-estilo)
- [Componentes Principales](#componentes-principales)
- [Cómo Actualizar la Documentación](#cómo-actualizar-la-documentación)
- [Desarrollo Local](#desarrollo-local)

---

## 🗂️ Estructura del Proyecto

```
projects/playground/
├── src/
│   ├── app/
│   │   ├── playground/                       # Documentación principal
│   │   │   ├── layout/                 # Componentes de layout
│   │   │   │   ├── docs-layout.ts      # Layout principal (Header + Sidebar + Content)
│   │   │   │   ├── header/             # Header fijo superior
│   │   │   │   └── sidebar/            # Navegación lateral
│   │   │   ├── pages/                  # Páginas de contenido
│   │   │   │   ├── intro/              # Página de introducción
│   │   │   │   ├── schedule-doc/       # Documentación del componente Schedule
│   │   │   │   ├── button-doc/         # Documentación de botones
│   │   │   │   └── api/                # Páginas de API Reference
│   │   │   │       ├── scheduler-config/
│   │   │   │       ├── event-model/
│   │   │   │       ├── resource-model/
│   │   │   │       └── view-mode/
│   │   │   └── shared/                 # Componentes compartidos
│   │   │       ├── code-block/         # Bloques de código con syntax highlighting
│   │   │       ├── api-table/          # Tablas de propiedades API
│   │   │       └── example-viewer/     # Visor de ejemplos (Preview/Code tabs)
│   │   ├── app.routes.ts               # Configuración de rutas
│   │   └── app.ts                      # Componente raíz
│   ├── styles.scss                     # Estilos globales (Tailwind + ng-scheduler overrides)
│   └── index.html
└── README.md                           # Este archivo
```

---

## 🏗️ Arquitectura

### Patrón de Diseño

La documentación utiliza una **arquitectura de componentes standalone** de Angular, organizada en tres capas principales:

2. **Pages Layer** (`docs/pages/`)
   - Páginas de contenido específico
   - Cada página es un componente standalone con su propio template HTML
   - Organizadas por categorías: introducción, componentes, API

3. **Shared Layer** (`docs/shared/`)
   - Componentes reutilizables para presentar documentación
   - `CodeBlockComponent`: Renderiza código con PrismJS
   - `ApiTableComponent`: Muestra propiedades de API en formato tabla
   - `ExampleViewerComponent`: Tabs de Preview/Code para ejemplos interactivos

### Routing

```typescript
{
  path: 'docs',
  component: DocsLayoutComponent,
  children: [
    { path: 'introduction', component: IntroComponent },
    { path: 'components/schedule', component: ScheduleDocComponent },
    { path: 'api/scheduler-config', component: SchedulerConfigDocComponent },
    // ...
  ]
}
```

- **Ruta raíz** (`/`) → Redirige a `/docs/introduction`
- **Rutas de componentes** → `/docs/components/{component-name}`
- **Rutas de API** → `/docs/api/{interface-name}`

---

## 🎨 Diseño y Estilo

### Stack Tecnológico

- **Tailwind CSS v3**: Framework de utilidades CSS para styling
- **PrismJS**: Syntax highlighting para bloques de código
- **Google Fonts**: Roboto para tipografía
- **Material Icons**: Iconografía

### Paleta de Colores

La documentación utiliza una paleta de azules basada en **#0860c4**:

```scss
--primary-50: #e6f2ff
--primary-100: #cce5ff
--primary-200: #99cbff
--primary-300: #66b0ff
--primary-400: #3396ff
--primary-500: #0860c4  // Color base
--primary-600: #0651a3
--primary-700: #054282
--primary-800: #043461
--primary-900: #022541
--primary-950: #011220
```

### Layout

- **Header**: Fijo en la parte superior (h-16, 64px)
- **Sidebar**: Fijo a la izquierda, width 256px (w-64)
- **Main Content**: 
  - Margin izquierdo: 256px (ml-64) para espacio del sidebar
  - Padding superior: 96px (pt-24) para evitar superposición con header
  - Max width: 1280px (max-w-5xl)

### Principios de Diseño

1. **Claridad**: Jerarquía visual clara con tipografía grande para títulos
2. **Consistencia**: Uso de componentes compartidos para elementos repetitivos
3. **Accesibilidad**: Colores con contraste adecuado, semántica HTML correcta
4. **Interactividad**: Ejemplos ejecutables, código copiable, navegación intuitiva

---

## 🧩 Componentes Principales

### CodeBlockComponent

Renderiza código con syntax highlighting y botón de copiar.

```typescript
<app-code-block 
  [code]="exampleCode" 
  [language]="'typescript'">
</app-code-block>
```

**Lenguajes soportados**: `typescript`, `javascript`, `html`, `scss`, `bash`, `json`

### ApiTableComponent

Muestra propiedades de API en formato tabla con soporte para links.

```typescript
<app-api-table [properties]="properties"></app-api-table>

// Definición de propiedades
properties: ApiProperty[] = [
  { 
    name: 'config',
    type: 'SchedulerConfig',
    typeLink: '/docs/api/scheduler-config', // Opcional: link a página API
    description: 'Configuration object',
    defaultValue: 'DEFAULT_CONFIG'
  }
]
```

### ExampleViewerComponent

Visor con tabs para mostrar preview y código del ejemplo.

```html
<app-example-viewer [code]="code" [language]="'typescript'">
  <div preview>
    <!-- Contenido del preview aquí -->
  </div>
</app-example-viewer>
```

---

## 📝 Cómo Actualizar la Documentación

### 1. Agregar una Nueva Página de Componente

**Paso 1**: Crear el componente y su template

```bash
# Crear archivos
touch projects/playground/src/app/docs/pages/my-component-doc/my-component-doc.ts
touch projects/playground/src/app/docs/pages/my-component-doc/my-component-doc.html
```

**Paso 2**: Definir el componente

```typescript
// my-component-doc.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiTableComponent, ApiProperty } from '../../shared/api-table/api-table';
import { CodeBlockComponent } from '../../shared/code-block/code-block';
import { ExampleViewerComponent } from '../../shared/example-viewer/example-viewer';

@Component({
  selector: 'app-my-component-doc',
  standalone: true,
  imports: [CommonModule, ApiTableComponent, CodeBlockComponent, ExampleViewerComponent],
  templateUrl: './my-component-doc.html'
})
export class MyComponentDocComponent {
  // Definir inputs, outputs, ejemplos de código
}
```

**Paso 3**: Crear el template HTML

```html
<!-- my-component-doc.html -->
<div class="space-y-12">
  <header>
    <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Mi Componente</h1>
    <p class="text-xl text-gray-500">Descripción del componente.</p>
  </header>

  <section>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Uso Básico</h2>
    <app-example-viewer [code]="exampleCode">
      <div preview>
        <!-- Ejemplo en vivo -->
      </div>
    </app-example-viewer>
  </section>

  <section>
    <h2 class="text-2xl font-bold text-gray-900 mb-4">API</h2>
    <app-api-table [properties]="inputs"></app-api-table>
  </section>
</div>
```

**Paso 4**: Agregar ruta en `app.routes.ts`

```typescript
import { MyComponentDocComponent } from './docs/pages/my-component-doc/my-component-doc';

export const routes: Routes = [
  {
    path: 'docs',
    component: DocsLayoutComponent,
    children: [
      // ... rutas existentes
      { path: 'components/my-component', component: MyComponentDocComponent }
    ]
  }
];
```

**Paso 5**: Agregar link en el sidebar (`sidebar.html`)

```html
<a routerLink="/docs/components/my-component" 
   routerLinkActive="bg-primary-50 text-primary-600 border-r-4 border-primary-600"
   class="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
  Mi Componente
</a>
```

### 2. Agregar una Nueva Página de API

Sigue los mismos pasos que arriba, pero:
- Coloca el archivo en `docs/pages/api/`
- Usa la ruta `/docs/api/my-interface`
- Agrega el link en la sección "API" del sidebar

**Ejemplo de estructura para una interfaz:**

```typescript
export class MyInterfaceDocComponent {
  properties: ApiProperty[] = [
    { name: 'id', type: 'string', description: 'Unique identifier' },
    { name: 'name', type: 'string', description: 'Display name' },
    // ...
  ];

  usageExample = `
const example: MyInterface = {
  id: '123',
  name: 'Example'
};
  `.trim();
}
```

### 3. Actualizar Estilos Globales

Edita `projects/playground/src/styles.scss`:

```scss
:root {
  // Override ng-scheduler variables
  --mglon-schedule-primary-500: #0860c4;
  
  // Agregar nuevas variables si es necesario
}
```

### 4. Agregar Nuevos Ejemplos de Código

```typescript
exampleCode = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '<div>Hello World</div>'
})
export class ExampleComponent {}
`.trim();
```

**Nota**: Usa `.trim()` para eliminar espacios en blanco al inicio/final.

---

## 💻 Desarrollo Local

### Iniciar el servidor de desarrollo

```bash
npm start
```

Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

### Compilar para producción

```bash
npm run build playground
```

Los archivos compilados estarán en `dist/playground/`.

### Estructura de archivos generados

```
dist/playground/browser/
├── index.html
├── main-*.js
├── styles-*.css
└── ...
```

---

## 🔧 Configuración

### Tailwind

La configuración de Tailwind está en `/tailwind.config.js` (raíz del workspace):

```javascript
module.exports = {
  content: [
    "./projects/playground/src/**/*.{html,ts}",
    "./projects/ng-scheduler/src/lib/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: { /* paleta de azules */ }
      }
    }
  }
}
```

### PrismJS

Lenguajes configurados en `CodeBlockComponent`:

```typescript
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
```

Para agregar más lenguajes, importa el componente correspondiente.

---

## 📚 Recursos Adicionales

- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [PrismJS](https://prismjs.com/)
- [Angular Standalone Components](https://angular.dev/guide/components/importing)
- [Angular Router](https://angular.dev/guide/routing)

---

## 📄 Licencia

Este proyecto está bajo la misma licencia que `ng-scheduler`.
