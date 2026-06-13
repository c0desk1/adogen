// src/lib/history.ts

export interface HistoryItem {
  id: string;
  filename: string;
  title: string;
  keywords: string;
  category: string;
  imageData: string;
  engine: string;
  model: string;
  timestamp: number;
  favorite: boolean;
}

const STORAGE_KEY = 'adogen-history';

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function addHistoryItem(item: HistoryItem): void {
  const history = getHistory();
  const exists = history.find(h => h.id === item.id);
  if (!exists) {
    history.unshift(item);
    saveHistory(history);
  }
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory().filter(h => h.id !== id);
  saveHistory(history);
}

export function toggleFavorite(id: string): void {
  const history = getHistory().map(h =>
    h.id === id ? { ...h, favorite: !h.favorite } : h
  );
  saveHistory(history);
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}