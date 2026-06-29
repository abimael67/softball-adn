# Guía de Cálculo de Estadísticas

Este documento describe cómo deben calcularse las estadísticas derivadas en futuras fases de desarrollo.

---

## Principio Fundamental

**Solo juegos completados contribuyen a estadísticas.**

Antes de cualquier cálculo, filtrar:
```typescript
const validStats = stats.filter(s => {
  const game = gamesMap.get(s.game_id);
  return game?.status === 'completed';
});
```

---

## Estadísticas de Bateo

### Batting Average (AVG)

**Fórmula:** `H / AB`

**Implementación:**
```typescript
function calculateBattingAverage(hits: number, atBats: number): number | null {
  if (atBats === 0) return null;
  return hits / atBats;
}
```

**Nota:** Retornar `null` cuando AB = 0 para evitar división por cero.

---

### On-Base Percentage (OBP)

**Fórmula:** `(H + BB + HBP) / (AB + BB + HBP + SF)`

**Implementación:**
```typescript
function calculateOBP(
  hits: number,
  walks: number,
  hitByPitch: number,
  atBats: number,
  sacrificeFlies: number
): number | null {
  const denominator = atBats + walks + hitByPitch + sacrificeFlies;
  if (denominator === 0) return null;
  return (hits + walks + hitByPitch) / denominator;
}
```

---

### Slugging Percentage (SLG)

**Fórmula:** `TB / AB`

Donde `TB = H + 2B + (2 × 3B) + (3 × HR)`

**Nota:** Singles = H - 2B - 3B - HR, entonces:
`TB = Singles + (2 × 2B) + (3 × 3B) + (4 × HR)`
`TB = (H - 2B - 3B - HR) + (2 × 2B) + (3 × 3B) + (4 × HR)`
`TB = H + 2B + (2 × 3B) + (3 × HR)`

**Implementación:**
```typescript
function calculateSluggingPercentage(
  hits: number,
  doubles: number,
  triples: number,
  homeRuns: number,
  atBats: number
): number | null {
  if (atBats === 0) return null;
  const totalBases = hits + doubles + (2 * triples) + (3 * homeRuns);
  return totalBases / atBats;
}
```

---

### OPS (On-base Plus Slugging)

**Fórmula:** `OBP + SLG`

**Implementación:**
```typescript
function calculateOPS(obp: number | null, slg: number | null): number | null {
  if (obp === null || slg === null) return null;
  return obp + slg;
}
```

---

### Total Bases (TB)

**Fórmula:** `H + 2B + (2 × 3B) + (3 × HR)`

---

### Plate Appearances (PA)

**Fórmula:** `AB + BB + HBP + SF`

**Nota:** No incluye sacrifice bunts (no almacenados en el schema actual).

---

## Estadísticas de Pitcheo

### Earned Run Average (ERA)

**Fórmula:** `(ER × 7) / IP`

**Nota:** Se usa 7 innings por juego (softball estándar).

**Implementación:**
```typescript
function calculateERA(earnedRuns: number, inningsPitched: number): number | null {
  if (inningsPitched === 0) return null;
  return (earnedRuns * 7) / inningsPitched;
}
```

**Manejo de innings fraccionarios:**
- IP se almacena como decimal (ej: 6.1 = 6 innings y 1 out)
- Convertir a outs: `Math.floor(IP) * 3 + Math.round((IP % 1) * 10)`
- O usar directamente el decimal en la fórmula

---

### WHIP (Walks + Hits per Inning)

**Fórmula:** `(BB + H) / IP`

**Implementación:**
```typescript
function calculateWHIP(
  walks: number,
  hitsAllowed: number,
  inningsPitched: number
): number | null {
  if (inningsPitched === 0) return null;
  return (walks + hitsAllowed) / inningsPitched;
}
```

---

### Strikeouts per 7 Innings (K/7)

**Fórmula:** `(K × 7) / IP`

---

## Estadísticas de Equipo

### Winning Percentage (PCT)

**Fórmula:** `W / (W + L)`

**Implementación:**
```typescript
function calculateWinningPercentage(wins: number, losses: number): number {
  const total = wins + losses;
  if (total === 0) return 0;
  return wins / total;
}
```

---

### Games Behind (GB)

**Fórmula:** `((Líder_W - Equipo_W) + (Equipo_L - Líder_L)) / 2`

**Implementación:**
```typescript
function calculateGamesBehind(
  leaderWins: number,
  leaderLosses: number,
  teamWins: number,
  teamLosses: number
): number {
  return ((leaderWins - teamWins) + (teamLosses - leaderLosses)) / 2;
}
```

**Nota:** El líder siempre tiene GB = 0.

---

### Run Differential (DIFF)

**Fórmula:** `RS - RA`

Donde:
- RS = Runs Scored (carreras anotadas)
- RA = Runs Allowed (carreras permitidas)

---

## Fielding Percentage

**Fórmula:** `(PO + A) / (PO + A + E)`

**Implementación:**
```typescript
function calculateFieldingPercentage(
  putouts: number,
  assists: number,
  errors: number
): number | null {
  const totalChances = putouts + assists + errors;
  if (totalChances === 0) return null;
  return (putouts + assists) / totalChances;
}
```

---

## Reglas de Calificación (Futuro)

Cuando se implementen reglas de calificación para líderes:

### Bateo
- **Mínimo de apariciones al bate (PA):** `AB + BB + HBP + SF`
- **Mínimo de juegos jugados:** Contar juegos únicos en batting_stats

### Pitcheo
- **Mínimo de entradas lanzadas (IP):** Sumar innings_pitched
- **Mínimo de juegos lanzados:** Contar juegos únicos en pitching_stats

**Estructura sugerida:**
```typescript
interface QualificationConfig {
  batting: {
    minimumPlateAppearances: number;
    minimumGames: number;
  };
  pitching: {
    minimumInningsPitched: number;
    minimumGames: number;
  };
}
```

---

## Ordenamiento de Líderes

### Categorías donde mayor es mejor:
- batting_average, home_runs, rbi, runs, hits, stolen_bases
- on_base_percentage, slugging_percentage, ops
- wins, strikeouts_pitching, saves

### Categorías donde menor es mejor:
- era, whip

**Implementación:**
```typescript
const LOWER_IS_BETTER: LeaderCategory[] = ["era", "whip"];

function sortLeaders(leaders: Leader[], category: LeaderCategory): Leader[] {
  const direction = LOWER_IS_BETTER.includes(category) ? 1 : -1;
  return leaders.sort((a, b) => direction * (a.value - b.value));
}
```

---

## Equipo en Estadísticas

**Regla crítica:** Siempre usar `team_id` de la estadística, nunca inferir del roster actual.

```typescript
// ✅ CORRECTO
const teamName = teamsMap.get(stat.team_id)?.name;

// ❌ INCORRECTO
const currentRoster = rosters.find(r => r.player_id === stat.player_id);
const teamName = teamsMap.get(currentRoster?.team_id)?.name;
```

---

## Agregación de Estadísticas

### Totales de Temporada
```typescript
const seasonTotals = stats
  .filter(s => s.season_id === targetSeasonId)
  .reduce((acc, stat) => ({
    atBats: acc.atBats + stat.at_bats,
    hits: acc.hits + stat.hits,
    // ... otros campos
  }), initialTotals);
```

### Totales de Carrera
```typescript
const careerTotals = allSeasonsStats.reduce((acc, stat) => ({
  atBats: acc.atBats + stat.at_bats,
  hits: acc.hits + stat.hits,
  // ... otros campos
}), initialTotals);
```

### Totales por Equipo (dentro de una temporada)
```typescript
const teamTotals = stats
  .filter(s => s.season_id === targetSeasonId && s.team_id === targetTeamId)
  .reduce(/* ... */);
```

---

## Precisión Numérica

- Almacenar estadísticas derivadas con **3 decimales** para porcentajes
- Redondear al mostrar: **AVG a .XXX**, **ERA a X.XX**
- Usar `toFixed()` para formateo consistente

```typescript
function formatBattingAverage(avg: number): string {
  return avg.toFixed(3).substring(1); // ".325" en lugar de "0.325"
}

function formatERA(era: number): string {
  return era.toFixed(2); // "3.45"
}
```

---

*Última actualización: Fase 3 - Reglas de Negocio*
