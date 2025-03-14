
// Utility functions for local storage management

// API Key
const API_KEY_STORAGE_KEY = "metamind-openai-api-key";

export const saveApiKey = (apiKey: string): void => {
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
};

export const getApiKey = (): string => {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || "";
};

// User preferences
const USER_PREFS_STORAGE_KEY = "metamind-user-preferences";

interface UserPreferences {
  darkMode?: boolean;
  notifications?: boolean;
  [key: string]: any;
}

export const saveUserPreferences = (prefs: UserPreferences): void => {
  localStorage.setItem(USER_PREFS_STORAGE_KEY, JSON.stringify(prefs));
};

export const getUserPreferences = (): UserPreferences => {
  const prefsStr = localStorage.getItem(USER_PREFS_STORAGE_KEY);
  if (!prefsStr) return {};
  try {
    return JSON.parse(prefsStr);
  } catch (e) {
    console.error("Error parsing user preferences:", e);
    return {};
  }
};
