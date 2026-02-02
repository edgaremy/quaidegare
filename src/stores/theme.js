import { writable } from 'svelte/store';

// Detect system theme preference
function getSystemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

// Get initial theme: manual preference from localStorage, or system theme, or default to 'light'
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
const manualPreference = typeof window !== 'undefined' ? localStorage.getItem('theme-manual') : null;
const initialTheme = storedTheme || (manualPreference === null ? getSystemTheme() : 'light');

// Create the writable store
function createThemeStore() {
  const { subscribe, set, update } = writable(initialTheme);

  // Apply theme to document
  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('data-theme', initialTheme);
    
    // Listen for system theme changes if no manual preference is set
    if (manualPreference === null && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        set(newTheme);
      };
      mediaQuery.addEventListener('change', handleChange);
    }
  }

  return {
    subscribe,
    set: (value) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', value);
        localStorage.setItem('theme-manual', 'true'); // Mark as manual preference
        document.documentElement.setAttribute('data-theme', value);
      }
      set(value);
    },
    toggle: () => {
      update(currentTheme => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', newTheme);
          localStorage.setItem('theme-manual', 'true'); // Mark as manual preference
          document.documentElement.setAttribute('data-theme', newTheme);
        }
        return newTheme;
      });
    }
  };
}

export const theme = createThemeStore();
