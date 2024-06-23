import { Orientation } from "unsplash-js";

// 4x3, 4x4, 5x4, 6x6 grid sizes
export const VALID_PAIR_COUNTS = [6, 8, 10, 18]
export type PairCount = 6 | 8 | 10 | 18;

export type Theme = "cities" | "nature" | "travel" | "architecture" | "textures" | "animals" | "people" | "food" | "candy" | "sports" | "art";

export type Settings = {
  clearSelectionTimer: number;
  pairCount: PairCount;
  theme: Theme;
  orientation: Orientation;
}

export const defaultSettings: Settings = {
  clearSelectionTimer: 2000,
  pairCount: 6,
  theme: "cities",
  orientation: "landscape",
}

export function loadSettings(): Settings {
  if (typeof localStorage !== 'undefined') {
    const savedSettingsJSON = localStorage.getItem('memory-game-settings')
    if (savedSettingsJSON) {
      // TODO: add zod for runtime validation
      const savedSettings = JSON.parse(savedSettingsJSON)
      return {...defaultSettings, ...savedSettings}
    }
  }

  return defaultSettings
}

export function saveSettings(settings: Settings) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('memory-game-settings', JSON.stringify(settings))
  }
}
