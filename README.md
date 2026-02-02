# Gestel 2026 - Frontend

Proyecto Angular 16 con Bootstrap 5.3 para el sistema de gestión de traps de telecomunicaciones.

## 🚀 Características

### ✅ Funcionalidades Implementadas

- **Arquitectura Angular 16** con TypeScript y las mejores prácticas
- **Diseño Responsive** con Bootstrap 5.3
- **Paleta de colores** profesional del celeste oscuro al blanco
- **Componentes Reutilizables**:
  - Tablas paginadas con ordenamiento
  - Filtros dinámicos con búsqueda
  - Modales de confirmación
  - Sistema de alertas
  - Paginación personalizada

### 📋 Módulos Desarrollados

#### 🏢 Clientes
- Listado paginado con filtros
- Estadísticas en tiempo real
- Exportación a CSV y Excel
- Botones de acción (Editar, Ver, Eliminar)
- Confirmación de eliminación

#### 🏗️ Edificios
- Listado con relación a Clientes y Provincias
- Filtros por nombre, cliente y estado
- Estadísticas detalladas
- Exportación de datos
- Gestión completa CRUD

### 🎨 Diseño y UX

- **Navegación principal** con menú desplegable
- **Diseño responsive** para móviles, tablets y desktop
- **Animaciones suaves** y micro-interacciones
- **Colores consistentes** con variables CSS
- **Tipografía legible** y accesible
- **Componentes accesibles** con ARIA labels

## 🛠️ Tecnologías

- **Angular 16** - Framework principal
- **TypeScript** - Tipado estático
- **Bootstrap 5.3** - Framework CSS
- **Bootstrap Icons** - Iconos
- **HttpClient** - Comunicación con API
- **Forms (Reactive & Template)** - Formularios
- **RxJS** - Programación reactiva

## 📦 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── alert.component.ts
│   │   │   ├── data-table.component.ts
│   │   │   ├── filters.component.ts
│   │   │   ├── modal-confirm.component.ts
│   │   │   └── pagination.component.ts
│   │   ├── pages/               # Páginas principales
│   │   │   ├── cliente/
│   │   │   └── edificio/
│   │   ├── services/            # Servicios HTTP
│   │   │   ├── cliente.service.ts
│   │   │   ├── edificio.service.ts
│   │   │   ├── error-handling.service.ts
│   │   │   └── utils.service.ts
│   │   ├── models/              # Interfaces TypeScript
│   │   │   ├── cliente.model.ts
│   │   │   └── edificio.model.ts
│   │   ├── environments/        # Configuraciones
│   │   └── app.routing.module.ts # Rutas
│   ├── styles.css               # Estilos globales
│   └── index.html              # HTML principal
├── angular.json                 # Configuración Angular
├── package.json                 # Dependencias NPM
└── README.md                    # Este archivo
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js 16+ 
- npm 8+

### Pasos

1. **Instalar dependencias**
   ```bash
   cd frontend
   npm install
   ```

2. **Configurar API Backend**
   - Editar `src/environments/environment.ts`
   - Asegurar que apunta a: `http://localhost:8000`

3. **Iniciar servidor de desarrollo**
   ```bash
   npm start
   ```
   La aplicación estará disponible en `http://localhost:4200`

4. **Compilar para producción**
   ```bash
   npm run build
   ```

## 🔗 Conexión con API Backend

El frontend está configurado para consumir los siguientes endpoints:

### Clientes
- `GET /v1/clientes` - Listar clientes
- `GET /v1/clientes/{id}` - Obtener cliente
- `POST /v1/clientes` - Crear cliente
- `PUT /v1/clientes/{id}` - Actualizar cliente
- `DELETE /v1/clientes/{id}` - Eliminar cliente
- `GET /v1/clientes/stats/resumen` - Estadísticas

### Edificios
- `GET /v1/edificios` - Listar edificios
- `GET /v1/edificios/{id}` - Obtener edificio
- `POST /v1/edificios` - Crear edificio
- `PUT /v1/edificios/{id}` - Actualizar edificio
- `DELETE /v1/edificios/{id}` - Eliminar edificio
- `GET /v1/edificios/stats/resumen` - Estadísticas

## 📊 Componentes Reutilizables

### DataTableComponent
Tabla configurable con:
- Ordenamiento de columnas
- Paginación integrada
- Botones de acción personalizables
- Estados de loading y empty

### FiltersComponent
Sistema de filtros con:
- Inputs de texto con debounce
- Selects dinámicos
- Date pickers
- Botón de limpiar filtros

### PaginationComponent
Paginación con:
- Cambio dinámico de page size
- Navegación por página
- Total de registros
- Diseño responsive

### ModalConfirmComponent
Modal de confirmación con:
- Título y mensaje personalizables
- Botones de confirmar/cancelar
- Diseño consistente

## 🎨 Guía de Estilos

### Colores Principales
- **Primary Dark**: `#0a4d68` (celeste oscuro)
- **Primary Medium**: `#088395` 
- **Primary Light**: `#05bfdb`
- **Primary Lighter**: `#00ffca`

### Clases CSS
- `.gestel-card` - Cards con sombra y hover
- `.btn-primary-custom` - Botones con gradiente
- `.gestel-table` - Tablas estilizadas
- `.badge-active` / `.badge-inactive` - Badges de estado

## 🔮 Próximos Pasos

### Pendientes de Desarrollo
- [ ] Formularios de Creación/Edición
- [ ] Vistas para Provincias
- [ ] Vistas para Dominios  
- [ ] Vistas para Enlaces
- [ ] Sistema de autenticación
- [ ] Gestión de usuarios y permisos

### Mejoras Técnicas
- [ ] Lazy loading de módulos
- [ ] Unit tests con Jest
- [ ] E2E tests con Cypress
- [ ] Optimización de bundle
- [ ] PWA capabilities
- [ ] Internacionalización (i18n)

## 🐛 Troubleshooting

### Errores Comunes

1. **Error de CORS**
   - Verificar configuración en backend
   - Habilitar CORS para `http://localhost:4200`

2. **Error 404 en API**
   - Verificar que el backend esté corriendo en `localhost:8000`
   - Revisar rutas en `environment.ts`

3. **Error de compilación**
   - Limpiar cache: `npm cache clean --force`
   - Reinstalar dependencias: `rm -rf node_modules && npm install`

## 📝 Licencia

Proyecto desarrollado para Gestel 2026 - Sistema de Gestión de Traps de Telecomunicaciones.

---

**Nota**: Este proyecto fue generado con Angular CLI versión 16.2.16 y sigue las mejores prácticas de desarrollo frontend moderno.# Gestel2026FrontEndAngular
