/**
 * Algoritmo de Distancia de Levenshtein
 * Calcula el número mínimo de operaciones requeridas para transformar una cadena en otra.
 * Las operaciones permitidas son: inserción, eliminación o sustitución de un carácter.
 * 
 * Complejidad de tiempo: O(m*n) donde m y n son las longitudes de las cadenas.
 * Complejidad de espacio: O(m*n)
 */
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Si una de las cadenas está vacía, la distancia es la longitud de la otra
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Inicializar la matriz
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Rellenar la matriz
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        // Los caracteres coinciden, no hay costo de operación
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        // Los caracteres son diferentes, tomamos el mínimo de (Sustitución, Inserción, Eliminación) + 1
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Sustitución
          Math.min(
            matrix[i][j - 1] + 1,   // Inserción
            matrix[i - 1][j] + 1    // Eliminación
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calcula un puntaje de relevancia (score) entre un término de búsqueda y los datos de un usuario.
 * A mayor puntaje, mayor es la relevancia.
 */
export function calculateSearchScore(query: string, username: string, name?: string | null, surname?: string | null): number {
  const q = query.toLowerCase().trim();
  const u = username.toLowerCase();
  const n = name ? name.toLowerCase() : "";
  const s = surname ? surname.toLowerCase() : "";
  const fullName = `${n} ${s}`.trim();

  let maxScore = 0;

  // 1. Coincidencia exacta (Premio Mayor)
  if (u === q || fullName === q) return 100;

  // 2. Coincidencia como prefijo (el usuario empieza con lo que se escribió)
  if (u.startsWith(q) || fullName.startsWith(q)) {
    maxScore = Math.max(maxScore, 80);
  }

  // 3. Contiene la palabra (Substring match)
  if (u.includes(q) || fullName.includes(q)) {
    maxScore = Math.max(maxScore, 60);
  }

  // 4. Distancia de Levenshtein (Fuzzy Search)
  // Calculamos la distancia y la convertimos en un score inversamente proporcional
  // Si la distancia es pequeña respecto a la longitud de la palabra, es buena coincidencia.
  const distUsername = levenshteinDistance(q, u);
  const distName = fullName ? levenshteinDistance(q, fullName) : Infinity;

  const minDist = Math.min(distUsername, distName);
  
  // Si la distancia es menor o igual a 3 (permite hasta 3 errores ortográficos)
  if (minDist <= 3) {
    // Calculamos un score basado en la distancia (distancia 0 ya está cubierta arriba)
    // d=1 -> score 50, d=2 -> score 40, d=3 -> score 30
    const fuzzyScore = 60 - (minDist * 10);
    maxScore = Math.max(maxScore, fuzzyScore);
  }

  return maxScore;
}
