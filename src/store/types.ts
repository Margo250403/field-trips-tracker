export type TeamTag = "HEHS" | "WPE" | "CP" | "PRoL" | "EWBN";

export interface Trip {
  id: string;
  date: string;               // ISO YYYY-MM-DD
  direction: string;          // локація
  participants: string[];     // імена
  teams: TeamTag[];           // теги
  purpose: string;            // коротка мета
  comment?: string;           // текст/іконка редагування
}

const KEY = "fieldtrips.trips";

export function loadTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Trip[]) : [];
  } catch {
    return [];
  }
}

export function saveTrips(trips: Trip[]) {
  localStorage.setItem(KEY, JSON.stringify(trips));
  // сповістимо інші вкладки/сторінки в межах цієї SPA
  window.dispatchEvent(new Event("trips-updated"));
}

// Одноразова ініціалізація демо-даними
export function seedTripsIfEmpty(seed: Trip[]) {
  const current = loadTrips();
  if (!current || current.length === 0) {
    saveTrips(seed);
  }
}