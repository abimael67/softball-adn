# Reglas de Negocio - Liga de Softball

Este documento define las reglas de negocio que gobiernan la aplicación. Todo desarrollo futuro debe seguir estas reglas para mantener consistencia.

---

## 1. Reglas de Juegos

### Estados de Juego

Un juego puede tener uno de los siguientes estados:

| Estado | Descripción | Afecta Standings | Afecta Estadísticas |
|--------|-------------|------------------|---------------------|
| `scheduled` | Programado para una fecha futura | No | No |
| `in_progress` | Actualmente en juego | No | No |
| `completed` | Finalizado con marcador final | **Sí** | **Sí** |
| `postponed` | Pospuesto | No | No |
| `cancelled` | Cancelado | No | No |
| `suspended` | Suspendido | No | No |

**Regla fundamental:** Solo los juegos con estado `completed` contribuyen a:
- Standings de equipos
- Estadísticas de jugadores
- Líderes de la liga

### Resultados de Juegos

**Los juegos no pueden terminar en empate.**

Todo juego completado produce:
- Un equipo ganador
- Un equipo perdedor

El marcador final siempre debe reflejar esta condición.

---

## 2. Standings de Equipos

### Cálculo

Los standings se calculan **exclusivamente** desde juegos completados.

**No se almacenan en la base de datos.** Se calculan dinámicamente.

### Campos Mostrados

| Campo | Descripción |
|-------|-------------|
| Wins (W) | Victorias |
| Losses (L) | Derrotas |
| Winning Percentage (PCT) | Porcentaje de victorias: W / (W + L) |
| Games Behind (GB) | Juegos de diferencia con el líder |
| Runs Scored (RS) | Carreras anotadas |
| Runs Allowed (RA) | Carreras permitidas |
| Run Differential (DIFF) | Diferencia de carreras: RS - RA |

### Criterios de Ranking

Los equipos se ordenan usando los siguientes criterios (en orden de prioridad):

1. **Porcentaje de Victorias** (Winning Percentage)
2. **Diferencial de Carreras** (Run Differential) - como desempate

### Cálculo de Games Behind (GB)

```
GB = ((Líder_W - Equipo_W) + (Equipo_L - Líder_L)) / 2
```

El equipo líder siempre tiene GB = 0.

---

## 3. Líderes de la Liga

### Cálculo

Los líderes se calculan **dinámicamente** desde estadísticas de juegos completados.

**No se almacenan en la base de datos.** Se calculan bajo demanda.

### Elegibilidad

En esta etapa, **todos los jugadores son elegibles** para aparecer en los rankings de líderes.

No hay requisitos de calificación actualmente.

### Extensibilidad Futura

La arquitectura debe facilitar la introducción de reglas de calificación como:
- Mínimo de apariciones al bate (plate appearances)
- Mínimo de entradas lanzadas (innings pitched)
- Mínimo de juegos jugados

Estas reglas deben ser configurables sin cambiar el diseño general.

---

## 4. Estadísticas

### Principio Fundamental

**Las estadísticas derivadas nunca se almacenan.**

Siempre se calculan desde estadísticas crudas de juegos.

### Estadísticas Crudas (Almacenadas)

Las estadísticas de juegos son la única fuente de verdad:
- `batting_stats` - Estadísticas de bateo por juego
- `pitching_stats` - Estadísticas de pitcheo por juego
- `fielding_stats` - Estadísticas de fildeo por juego

### Estadísticas Derivadas (Calculadas)

Ejemplos de estadísticas que se calculan:

**Bateo:**
- Batting Average (AVG) = H / AB
- On-Base Percentage (OBP) = (H + BB + HBP) / (AB + BB + HBP + SF)
- Slugging Percentage (SLG) = TB / AB
- OPS = OBP + SLG

**Pitcheo:**
- Earned Run Average (ERA) = (ER × 7) / IP
- WHIP = (BB + H) / IP
- Strikeouts per 7 innings (K/7)

**Equipo:**
- Winning Percentage = W / (W + L)

### Integridad Histórica

Las estadísticas representan **hechos históricos inmutables**.

Cada estadística almacena:
- `season_id` - Temporada
- `game_id` - Juego
- `player_id` - Jugador
- `team_id` - Equipo al momento del juego

**Nunca inferir el equipo desde el roster actual.**

---

## 5. Temporadas

### Principios

- Todo juego pertenece a una temporada
- Toda estadística pertenece a una temporada
- Todo roster pertenece a una temporada

### Estadísticas de Carrera

Las estadísticas de carrera se obtienen **agregando múltiples temporadas**.

Nunca duplicar totales de temporada.

### Integridad Histórica

El historial de temporadas **nunca debe modificarse**.

---

## 6. Rosters

### Transferencias de Jugadores

La aplicación soporta transferencias de jugadores entre equipos durante una temporada.

### Reglas de Roster

Aunque las reglas de la liga generalmente no permiten nuevas adquisiciones después de iniciar el torneo:

- Los administradores **siempre pueden modificar rosters** en situaciones excepcionales
- La aplicación **nunca debe hardcodear restricciones de roster**
- Las reglas de validación deben ser **configurables por administradores**

### Integridad Histórica

- Los registros históricos de roster **siempre se preservan**
- Las estadísticas históricas de juegos **nunca cambian** por modificaciones posteriores de roster

### Mecanismo de Transferencia

Cuando un jugador se transfiere:
1. El registro actual de roster se marca `is_active = false` con `left_at` establecido
2. Se crea un nuevo registro de roster con `is_active = true`
3. Las estadísticas de juegos antes de la transferencia muestran el equipo original
4. Las estadísticas de juegos después de la transferencia muestran el nuevo equipo

---

## 7. Integridad Histórica

### Principio Fundamental

Las estadísticas son **hechos históricos inmutables**.

### Garantías

- Cada estadística almacena explícitamente: temporada, juego, jugador, equipo
- Esta relación **nunca se infiere** del roster actual
- Los reportes históricos **siempre permanecen precisos** incluso si los jugadores se transfieren

### Ejemplo

Si un jugador se transfiere del Equipo A al Equipo B durante la temporada:
- Sus estadísticas con el Equipo A permanecen con `team_id = A`
- Sus estadísticas con el Equipo B tienen `team_id = B`
- Los totales de temporada suman ambas contribuciones
- Los reportes históricos muestran el equipo correcto en cada juego

---

## 8. Extensibilidad Futura

La arquitectura debe permitir agregar las siguientes funcionalidades sin rediseño de base de datos:

### Rondas de Playoff
- Temporadas pueden tener múltiples fases (regular, playoffs)
- Standings separados por fase

### Divisiones
- Equipos agrupados en divisiones
- Standings por división

### Reglas de Calificación
- Mínimo de apariciones al bate para líderes de bateo
- Mínimo de entradas lanzadas para líderes de pitcheo

### Continuación de Juegos Suspendidos
- Juegos suspendidos pueden reanudarse
- Estadísticas acumuladas desde la suspensión

### Regla de Misericordia (Mercy Rule)
- Juegos pueden terminar temprano por diferencia de carreras
- Marcador final registrado normalmente

### Forfeits
- Juegos pueden ser forfeitados
- Resultado registrado como completado

### Formatos de Torneo
- Round-robin
- Doble eliminación
- Swiss system

---

## 9. Resumen de Reglas Críticas

| Regla | Implementación |
|-------|----------------|
| Solo juegos completados cuentan | Filtrar por `status = 'completed'` |
| No empates | Validación en creación de juegos |
| Standings calculados | No almacenar, calcular dinámicamente |
| Líderes calculados | No almacenar, calcular dinámicamente |
| Estadísticas derivadas | Calcular desde stats crudas |
| Equipo en estadísticas | Almacenar explícitamente, no inferir |
| Rosters históricos | Preservar siempre, usar `is_active` |
| Transferencias | Múltiples registros de roster por temporada |

---

## 10. Referencia para Desarrollo Futuro

### Al Calcular Standings

```typescript
// Filtrar solo juegos completados
const completedGames = games.filter(g => g.status === 'completed');

// Calcular W/L desde completedGames
// Calcular RS/RA desde completedGames
// Ordenar por: 1) PCT, 2) DIFF
```

### Al Calcular Estadísticas de Jugador

```typescript
// Filtrar solo stats de juegos completados
const validStats = battingStats.filter(s => 
  gamesMap.get(s.game_id)?.status === 'completed'
);

// Agregar desde validStats
// Calcular derivados (AVG, OBP, SLG)
```

### Al Mostrar Equipo en Estadísticas

```typescript
// Usar team_id de la estadística, NO del roster actual
const team = teamsMap.get(stat.team_id);
```

---

*Última actualización: Fase 3 - Reglas de Negocio*
