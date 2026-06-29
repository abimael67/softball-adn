# Arquitectura de Autenticación y Autorización

Este documento describe la arquitectura de autenticación y autorización para el panel de administración de Softball ADN.

---

## Autenticación

### Proveedor: Supabase Auth

La aplicación utiliza **Supabase Auth** como proveedor de autenticación.

**Características:**
- Autenticación basada en email/password
- Tokens JWT para sesiones
- Integración nativa con Supabase Database
- Row Level Security (RLS) para protección a nivel de base de datos

### Flujo de Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. Supabase Auth valida credenciales
   ↓
3. Supabase genera JWT con user_id
   ↓
4. Frontend almacena token en memoria
   ↓
5. Frontend consulta user_roles para obtener roles
   ↓
6. Frontend calcula permisos basados en roles
   ↓
7. Usuario accede al panel según permisos
```

### Tabla user_roles

Mapea usuarios de Supabase (`auth.users`) a roles de la aplicación.

```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  role user_role, -- 'administrator' | 'collaborator'
  assigned_at TIMESTAMPTZ,
  assigned_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

**Restricciones:**
- Un usuario puede tener múltiples roles
- Cada combinación (user_id, role) es única
- Solo roles activos (`is_active = true`) se consideran

---

## Roles de Usuario

### Administrator (Administrador)

**Acceso completo al sistema.**

**Permisos:**
- ✅ Gestionar temporadas
- ✅ Gestionar equipos
- ✅ Gestionar jugadores
- ✅ Gestionar sedes
- ✅ Gestionar rosters
- ✅ Gestionar juegos
- ✅ Editar estadísticas
- ✅ Aprobar juegos
- ✅ Publicar juegos
- ✅ Gestionar usuarios
- ✅ Ver registro de auditoría
- ✅ Subir hojas de puntuación
- ✅ Ingresar estadísticas
- ✅ Enviar juegos a revisión
- ✅ Ver juegos asignados

### Collaborator (Colaborador)

**Ingreso de estadísticas y hojas de puntuación.**

**Permisos:**
- ❌ Gestionar temporadas
- ❌ Gestionar equipos
- ❌ Gestionar jugadores
- ❌ Gestionar sedes
- ❌ Gestionar rosters
- ❌ Gestionar juegos
- ❌ Editar estadísticas (solo ingresar)
- ❌ Aprobar juegos
- ❌ Publicar juegos
- ❌ Gestionar usuarios
- ❌ Ver registro de auditoría
- ✅ Subir hojas de puntuación
- ✅ Ingresar estadísticas
- ✅ Enviar juegos a revisión
- ✅ Ver juegos asignados

---

## Autorización

### Modelo de Permisos

La autorización se basa en **permisos** que se derivan de los roles del usuario.

```typescript
type Permission =
  | "manage_seasons"
  | "manage_teams"
  | "manage_players"
  | "manage_venues"
  | "manage_rosters"
  | "manage_games"
  | "edit_statistics"
  | "approve_games"
  | "publish_games"
  | "manage_users"
  | "view_audit_log"
  | "upload_score_sheets"
  | "enter_statistics"
  | "submit_games"
  | "view_assigned_games";
```

### Verificación de Permisos

#### Frontend

El frontend verifica permisos antes de mostrar acciones:

```typescript
function hasPermission(roles: UserRole[], permission: Permission): boolean {
  return roles.some((role) => ROLE_PERMISSIONS[role].includes(permission));
}

// Ejemplo de uso
{user.permissions.includes("manage_teams") && (
  <Button onClick={handleEditTeam}>Editar Equipo</Button>
)}
```

**Importante:** La verificación en el frontend es solo para UX. **Nunca confiar solo en el frontend.**

#### Backend (Supabase RLS)

Supabase Row Level Security (RLS) debe aplicar permisos a nivel de base de datos:

```sql
-- Ejemplo: Solo administradores pueden editar equipos
CREATE POLICY "Admins can edit teams"
  ON teams
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role = 'administrator'
        AND is_active = true
    )
  );

-- Ejemplo: Colaboradores solo ven juegos asignados
CREATE POLICY "Collaborators see assigned games"
  ON games
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
        AND role = 'collaborator'
        AND is_active = true
    )
    -- Aquí se agregaría lógica de asignación de juegos
  );
```

### Contexto de Usuario

El frontend mantiene un contexto de usuario con roles y permisos:

```typescript
interface UserContext {
  userId: string;
  email: string;
  roles: UserRole[];
  permissions: Permission[];
  isAuthenticated: boolean;
}
```

Este contexto se usa para:
- Mostrar/ocultar elementos de UI
- Habilitar/deshabilitar acciones
- Redirigir a páginas de acceso denegado

---

## Seguridad

### Principios

1. **Defensa en profundidad:** Verificar permisos en frontend Y backend
2. **Mínimo privilegio:** Usuarios solo tienen permisos necesarios
3. **Auditoría completa:** Todas las acciones se registran en `audit_logs`
4. **Tokens seguros:** JWT almacenados en memoria, no en localStorage
5. **Sesiones cortas:** Tokens expiran y requieren re-autenticación

### Protección de Rutas

Las rutas admin están protegidas:

```typescript
// Verificar autenticación
if (!user.isAuthenticated) {
  redirect("/login");
}

// Verificar permisos
if (!user.permissions.includes("manage_teams")) {
  redirect("/admin/dashboard");
}
```

### Row Level Security (RLS)

**Todas las tablas deben tener RLS habilitado:**

```sql
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view teams"
  ON teams
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

---

## Flujo de Trabajo de Juegos

### Estados del Flujo

```
Scheduled
    ↓
In Progress
    ↓
Statistics Entry
    ↓
Pending Review
    ↓
Approved
    ↓
Published
```

### Transiciones Válidas

| Desde | Hacia | Acción | Permiso Requerido |
|-------|-------|--------|-------------------|
| scheduled | in_progress | Iniciar Juego | manage_games |
| in_progress | statistics_entry | Finalizar Juego | manage_games |
| scheduled | statistics_entry | Iniciar Ingreso | manage_games |
| statistics_entry | pending_review | Enviar a Revisión | submit_games |
| pending_review | approved | Aprobar | approve_games |
| pending_review | statistics_entry | Devolver | approve_games |
| approved | published | Publicar | publish_games |
| approved | statistics_entry | Devolver | approve_games |
| scheduled | postponed | Posponeer | manage_games |
| scheduled | cancelled | Cancelar | manage_games |

### Restricciones

- Solo juegos **published** contribuyen a standings y estadísticas
- Juegos en **pending_review** son de solo lectura para colaboradores
- Juegos **published** no pueden editarse
- Todas las transiciones se registran en `audit_logs`

---

## Auditoría

### Registro de Acciones

Todas las acciones administrativas se registran en `audit_logs`:

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

- Login/logout de usuarios
- Creación/edición de juegos
- Ingreso/edición de estadísticas
- Aprobación/publicación de juegos
- Modificación de rosters
- Creación/edición de jugadores, equipos, temporadas, sedes
- Asignación/revocación de roles
- Subida/eliminación de hojas de puntuación

### Historial de Versiones

Las estadísticas tienen historial completo en `stat_revisions`:

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

Esto permite:
- Ver quién cambió qué y cuándo
- Restaurar versiones anteriores si es necesario
- Auditar correcciones de estadísticas

---

## Implementación Futura

### Provider de Autenticación

```typescript
// src/providers/auth-provider.tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserContext | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Suscribirse a cambios de autenticación de Supabase
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          loadUserRoles(session.user.id);
        } else {
          setUser(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ... resto de la implementación
}
```

### Hook de Autorización

```typescript
// src/hooks/use-auth.ts
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export function usePermission(permission: Permission): boolean {
  const { user } = useAuth();
  return user?.permissions.includes(permission) ?? false;
}
```

### Componente de Protección de Ruta

```typescript
// src/components/auth/protected-route.tsx
export function ProtectedRoute({
  children,
  requiredPermission,
}: {
  children: ReactNode;
  requiredPermission?: Permission;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredPermission && !user.permissions.includes(requiredPermission)) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
}
```

---

## Resumen

| Componente | Tecnología | Ubicación |
|------------|------------|-----------|
| Autenticación | Supabase Auth | auth.users |
| Roles | user_roles | Base de datos |
| Permisos | Cálculo en frontend | src/lib/auth.ts |
| Autorización DB | Supabase RLS | Políticas SQL |
| Auditoría | audit_logs | Base de datos |
| Historial | stat_revisions | Base de datos |

**Principios clave:**
1. Autenticación con Supabase Auth
2. Roles mapeados en base de datos
3. Permisos derivados de roles
4. Verificación en frontend Y backend
5. Auditoría completa de todas las acciones
6. Historial de versiones para estadísticas

---

*Última actualización: Fase 4 - Panel de Administración*
