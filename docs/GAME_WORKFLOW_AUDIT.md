# Flujo de Trabajo de Juegos y Auditoría

Este documento describe el flujo de trabajo completo de juegos y el sistema de auditoría.

---

## Flujo de Trabajo de Juegos

### Diagrama de Estados

```
┌─────────────┐
│  scheduled  │
└──────┬──────┘
       │
       ├──────────────────────────────────┐
       │                                  │
       ↓                                  ↓
┌─────────────┐                  ┌─────────────┐
│ in_progress │                  │ postponed   │
└──────┬──────┘                  └─────────────┘
       │
       ↓
┌──────────────────┐
│ statistics_entry │ ←──────────────────────┐
└──────┬───────────┘                        │
       │                                    │
       ↓                                    │
┌────────────────┐                          │
│ pending_review │ ─────────────────────────┘
└──────┬─────────┘   (devolver para corrección)
       │
       ↓
┌──────────┐
│ approved │ ──────────────────────────────┐
└──────┬───┘                               │
       │                                   │
       ↓                                   │
┌──────────┐                               │
│ published│                               │
└──────────┘                               │
                                           │
┌──────────┐                               │
│ cancelled│                               │
└──────────┘                               │
```

### Estados del Flujo

#### 1. Scheduled (Programado)

**Descripción:** Juego programado para una fecha futura.

**Características:**
- Visible en calendario público
- Puede editarse (fecha, hora, sede)
- Puede cancelarse o posponerse
- No tiene estadísticas

**Acciones disponibles:**
- Iniciar juego → `in_progress`
- Iniciar ingreso de estadísticas → `statistics_entry`
- Posponeer → `postponed`
- Cancelar → `cancelled`

**Permisos requeridos:** `manage_games`

---

#### 2. In Progress (En Juego)

**Descripción:** Juego actualmente en progreso.

**Características:**
- Visible en calendario público como "En Juego"
- Puede editarse (marcador en vivo)
- No tiene estadísticas completas aún

**Acciones disponibles:**
- Finalizar juego → `statistics_entry`

**Permisos requeridos:** `manage_games`

---

#### 3. Statistics Entry (Ingreso de Estadísticas)

**Descripción:** Juego finalizado, estadísticas siendo ingresadas.

**Características:**
- No visible públicamente
- Estadísticas pueden editarse
- Hojas de puntuación pueden subirse
- Borradores se guardan automáticamente

**Acciones disponibles:**
- Enviar a revisión → `pending_review`

**Permisos requeridos:**
- Ingresar estadísticas: `enter_statistics`
- Subir hojas: `upload_score_sheets`
- Enviar a revisión: `submit_games`

**UX:**
- Interfaz optimizada para ingreso rápido
- Navegación por teclado
- Auto-guardado de borradores
- Validación en tiempo real

---

#### 4. Pending Review (Pendiente de Revisión)

**Descripción:** Juego enviado para revisión del administrador.

**Características:**
- No visible públicamente
- **Solo lectura para colaboradores**
- Administradores pueden revisar y editar
- Comparación con hojas de puntuación

**Acciones disponibles:**
- Aprobar → `approved`
- Devolver para corrección → `statistics_entry`

**Permisos requeridos:** `approve_games`

**Flujo de revisión:**
1. Administrador abre juego
2. Revisa estadísticas ingresadas
3. Compara con hojas de puntuación subidas
4. Hace correcciones si es necesario
5. Aprueba o devuelve

---

#### 5. Approved (Aprobado)

**Descripción:** Juego aprobado por administrador, listo para publicar.

**Características:**
- No visible públicamente aún
- Estadísticas congeladas
- Listo para publicación

**Acciones disponibles:**
- Publicar → `published`
- Devolver para corrección → `statistics_entry`

**Permisos requeridos:**
- Publicar: `publish_games`
- Devolver: `approve_games`

---

#### 6. Published (Publicado)

**Descripción:** Juego publicado y visible públicamente.

**Características:**
- **Visible en sitio público**
- **Contribuye a standings**
- **Contribuye a estadísticas de jugadores**
- **Contribuye a líderes de liga**
- **No puede editarse**

**Acciones disponibles:**
- Ninguna (estado final)

**Importante:**
- Solo juegos `published` afectan standings y estadísticas
- Estadísticas son inmutables después de publicar
- Correcciones requieren nuevo juego (no edición)

---

#### 7. Postponed (Pospuesto)

**Descripción:** Juego pospuesto para otra fecha.

**Características:**
- Visible en calendario como "Pospuesto"
- No tiene estadísticas
- No contribuye a standings

**Acciones disponibles:**
- Reprogramar → `scheduled` (nuevo juego)

---

#### 8. Cancelled (Cancelado)

**Descripción:** Juego cancelado.

**Características:**
- Visible en calendario como "Cancelado"
- No tiene estadísticas
- No contribuye a standings

**Acciones disponibles:**
- Ninguna (estado final)

---

## Ingreso de Estadísticas

### Pantalla de Ingreso

La pantalla de ingreso de estadísticas es la más importante del sistema.

**Requisitos:**
- ✅ Mobile friendly
- ✅ Desktop friendly
- ✅ Navegación por teclado
- ✅ Mínimo scrolling
- ✅ Auto-guardado
- ✅ Prevención de pérdida de datos

### Estructura de la Pantalla

```
┌─────────────────────────────────────────────────────────┐
│ Header: Equipo Local vs Equipo Visitante - Fecha        │
├─────────────────────────────────────────────────────────┤
│ Tabs: [Bateo] [Pitcheo] [Fildeo] [Hojas de Puntuación] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Equipo Local                                           │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Jugador        │ AB │ H │ 2B │ 3B │ HR │ RBI │  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Juan Pérez     │ 4  │ 2 │ 1  │ 0  │ 0  │ 1   │  │  │
│  │ María García   │ 3  │ 1 │ 0  │ 0  │ 1  │ 2   │  │  │
│  │ ...            │    │   │    │    │    │     │  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Equipo Visitante                                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Jugador        │ AB │ H │ 2B │ 3B │ HR │ RBI │  │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ ...            │    │   │    │    │    │     │  │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [Guardar Borrador]  [Enviar a Revisión]                 │
└─────────────────────────────────────────────────────────┘
```

### Optimización para Velocidad

**Inputs numéricos:**
```html
<input
  type="number"
  inputmode="numeric"
  pattern="[0-9]*"
  min="0"
  step="1"
/>
```

**Navegación por teclado:**
- Tab: Siguiente campo
- Shift+Tab: Campo anterior
- Enter: Siguiente jugador
- Arrow keys: Navegación entre celdas

**Auto-guardado:**
- Guardar cada 30 segundos
- Guardar al cambiar de tab
- Guardar al salir de la página
- Indicador visual de estado de guardado

**Prevención de pérdida:**
- Confirmación al salir sin guardar
- Recuperación de borradores al volver
- Historial de cambios locales

---

## Hojas de Puntuación

### Subida de Imágenes

**Requisitos:**
- Múltiples imágenes por juego
- Formatos: JPG, PNG, HEIC
- Tamaño máximo: 10MB por imagen
- Almacenamiento: Cloudflare R2

**Flujo:**
1. Usuario selecciona imágenes
2. Frontend muestra preview
3. Frontend sube a R2
4. Frontend guarda `image_key` en `game_score_sheets`
5. Imágenes disponibles para revisión

### Visualización

**Preview:**
- Thumbnails en grid
- Click para ver en grande
- Zoom y pan en viewer completo
- Descargar imagen original

**En revisión:**
- Administrador puede ver hojas mientras revisa estadísticas
- Comparación lado a lado (stats vs imagen)
- Notas sobre discrepancias

---

## Sistema de Auditoría

### Registro de Acciones

**Todas las acciones administrativas se registran en `audit_logs`.**

```typescript
interface AuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_email: string;
  action: AuditAction;
  entity: AuditEntity;
  entity_id: string;
  previous_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
  metadata: Record<string, unknown>;
  ip_address: string;
  user_agent: string;
}
```

### Acciones Auditadas

| Acción | Entidad | Descripción |
|--------|---------|-------------|
| user_login | user | Usuario inicia sesión |
| user_logout | user | Usuario cierra sesión |
| game_created | game | Se crea un juego |
| game_updated | game | Se edita un juego |
| game_submitted | game | Se envía a revisión |
| game_approved | game | Se aprueba un juego |
| game_published | game | Se publica un juego |
| game_returned | game | Se devuelve para corrección |
| statistics_entered | statistics | Se ingresan estadísticas |
| statistics_updated | statistics | Se editan estadísticas |
| roster_modified | roster | Se modifica un roster |
| player_created | player | Se crea un jugador |
| player_updated | player | Se edita un jugador |
| team_created | team | Se crea un equipo |
| team_updated | team | Se edita un equipo |
| season_created | season | Se crea una temporada |
| season_updated | season | Se edita una temporada |
| venue_created | venue | Se crea una sede |
| venue_updated | venue | Se edita una sede |
| user_role_assigned | user | Se asigna un rol |
| user_role_revoked | user | Se revoca un rol |
| score_sheet_uploaded | score_sheet | Se sube hoja de puntuación |
| score_sheet_deleted | score_sheet | Se elimina hoja de puntuación |

### Ejemplo de Registro

```json
{
  "id": "abc-123",
  "timestamp": "2026-06-28T15:30:00Z",
  "user_id": "user-456",
  "user_email": "admin@example.com",
  "action": "statistics_updated",
  "entity": "statistics",
  "entity_id": "game-789",
  "previous_values": {
    "player_id": "player-001",
    "stat_type": "batting",
    "hits": 1,
    "home_runs": 0
  },
  "new_values": {
    "player_id": "player-001",
    "stat_type": "batting",
    "hits": 2,
    "home_runs": 1
  },
  "metadata": {
    "reason": "Corrección basada en hoja de puntuación"
  },
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0..."
}
```

### Consulta de Auditoría

**Filtros disponibles:**
- Por acción (ej: `game_approved`)
- Por entidad (ej: `game`)
- Por usuario (ej: `user-456`)
- Por rango de fechas
- Por entidad específica (ej: `game-789`)

**UI de auditoría:**
```
┌─────────────────────────────────────────────────────────┐
│ Filtros: [Acción ▼] [Entidad ▼] [Usuario ▼] [Fecha]    │
├─────────────────────────────────────────────────────────┤
│ 2026-06-28 15:30 - admin@example.com                    │
│ Actualizó estadísticas de bateo                         │
│ Juego: Equipo A vs Equipo B                             │
│ Jugador: Juan Pérez                                     │
│ Cambios: hits 1→2, home_runs 0→1                        │
│ Razón: Corrección basada en hoja de puntuación          │
├─────────────────────────────────────────────────────────┤
│ 2026-06-28 14:15 - collaborator@example.com             │
│ Envió juego a revisión                                  │
│ Juego: Equipo A vs Equipo B                             │
└─────────────────────────────────────────────────────────┘
```

---

## Historial de Versiones de Estadísticas

### Propósito

**Rastrear todos los cambios a estadísticas para auditoría.**

```typescript
interface StatRevision {
  id: string;
  game_id: string;
  player_id: string;
  stat_type: "batting" | "pitching" | "fielding";
  revision_number: number;
  previous_values: Record<string, unknown>;
  new_values: Record<string, unknown>;
  changed_by: string;
  changed_at: string;
  reason: string;
}
```

### Flujo de Versiones

```
1. Colaborador ingresa estadísticas iniciales
   → stat_revisions: revision_number = 1, previous_values = null

2. Colaborador corrige error
   → stat_revisions: revision_number = 2, previous_values = v1

3. Administrador revisa y corrige
   → stat_revisions: revision_number = 3, previous_values = v2

4. Juego se publica
   → Estadísticas finales = v3
   → Historial completo disponible
```

### Consulta de Historial

**UI de historial:**
```
┌─────────────────────────────────────────────────────────┐
│ Historial de Estadísticas - Juan Pérez                  │
│ Juego: Equipo A vs Equipo B - 2026-06-28                │
├─────────────────────────────────────────────────────────┤
│ Revisión 3 - 2026-06-28 15:30 - admin@example.com       │
│ Razón: Corrección basada en hoja de puntuación          │
│ Cambios:                                                │
│   hits: 1 → 2                                           │
│   home_runs: 0 → 1                                      │
├─────────────────────────────────────────────────────────┤
│ Revisión 2 - 2026-06-28 14:00 - collaborator@example.com│
│ Razón: Error de dedo                                    │
│ Cambios:                                                │
│   hits: 2 → 1                                           │
├─────────────────────────────────────────────────────────┤
│ Revisión 1 - 2026-06-28 13:45 - collaborator@example.com│
│ Ingreso inicial                                         │
│ Valores:                                                │
│   AB: 4, H: 2, 2B: 1, 3B: 0, HR: 0, RBI: 1            │
└─────────────────────────────────────────────────────────┘
```

---

## Borradores

### Auto-guardado

**Estadísticas se guardan como borrador automáticamente:**
- Cada 30 segundos
- Al cambiar de tab
- Al salir de la página

**Indicador visual:**
```
✓ Guardado hace 5 segundos
⏳ Guardando...
⚠ No guardado - revisa tu conexión
```

### Recuperación de Borradores

**Al volver a un juego en `statistics_entry`:**
1. Frontend consulta estadísticas actuales
2. Si hay borrador más reciente, ofrece recuperar
3. Usuario elige: continuar con borrador o usar versión guardada

---

## Proceso de Revisión

### Flujo de Revisión

```
1. Colaborador envía juego a revisión
   → status: pending_review
   → audit_log: game_submitted

2. Administrador abre juego
   → Ve estadísticas ingresadas
   → Ve hojas de puntuación subidas

3. Administrador compara
   → Revisa cada estadística
   → Compara con imagen de hoja
   → Toma notas de discrepancias

4. Administrador decide:
   a) Aprobar → status: approved
   b) Devolver → status: statistics_entry + review_notes

5. Si se devuelve:
   → Colaborador ve notas de revisión
   → Hace correcciones
   → Vuelve a enviar

6. Si se aprueba:
   → Administrador publica
   → status: published
   → Visible públicamente
   → Contribuye a standings
```

### Notas de Revisión

**Administrador puede agregar notas:**
```
Campo: review_notes
Ejemplo: "Por favor verificar HR de Juan Pérez en la 3ra entrada. 
          La hoja muestra 2B, no HR."
```

**Colaborador ve notas al reabrir:**
```
┌─────────────────────────────────────────────────────────┐
│ ⚠ Notas de Revisión                                     │
│ Por favor verificar HR de Juan Pérez en la 3ra entrada. │
│ La hoja muestra 2B, no HR.                              │
└─────────────────────────────────────────────────────────┘
```

---

## Resumen del Flujo

| Estado | Visible Público | Contribuye Stats | Editable | Acción Siguiente |
|--------|-----------------|------------------|----------|------------------|
| scheduled | Sí (calendario) | No | Sí | in_progress, statistics_entry |
| in_progress | Sí (en juego) | No | Sí | statistics_entry |
| statistics_entry | No | No | Sí | pending_review |
| pending_review | No | No | Solo admin | approved, statistics_entry |
| approved | No | No | Solo admin | published, statistics_entry |
| published | **Sí** | **Sí** | **No** | - |
| postponed | Sí (pospuesto) | No | No | - |
| cancelled | Sí (cancelado) | No | No | - |

---

*Última actualización: Fase 4 - Panel de Administración*
