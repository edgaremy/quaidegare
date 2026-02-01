import { writable } from 'svelte/store';

// Get initial theme from localStorage or default to 'light'
const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
const initialTheme = storedTheme || 'light';

// Create the writable store
function createThemeStore() {
  const { subscribe, set, update } = writable(initialTheme);

  // Apply theme to document
  if (typeof window !== 'undefined') {
    document.documentElement.setAttribute('data-theme', initialTheme);
  }

  return {
    subscribe,
    set: (value) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', value);
        document.documentElement.setAttribute('data-theme', value);
      }
      set(value);
    },
    toggle: () => {
      update(currentTheme => {
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
        }
        return newTheme;
      });
    }
  };
}

export const theme = createThemeStore();
