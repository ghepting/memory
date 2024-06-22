export type Settings = {
  pairCount: 6 | 8 | 10 | 18; // 4x3, 4x4, 5x4, 6x6 grid sizes
  clearSelectionTimer: number;
}

export const defaultSettings: Settings = { pairCount: 6, clearSelectionTimer: 2000 }

export function loadSettings(): Settings {
  if (typeof localStorage !== 'undefined') {
    console.log('loading settings from localStorage')
    const savedSettingsJSON = localStorage.getItem('memory-game-settings')
    if (savedSettingsJSON) {
      console.log('loaded settings:', savedSettingsJSON)
      // TODO: add zod for runtime validation
      return JSON.parse(savedSettingsJSON)
    }
  }

  return defaultSettings
}

export function saveSettings(settings: Settings) {
  if (typeof localStorage !== 'undefined') {
    console.log('saving settings to localStorage')
    localStorage.setItem('memory-game-settings', JSON.stringify(settings))
    console.log('saved settings:', loadSettings())
  }
}