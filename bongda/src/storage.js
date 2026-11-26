const KEY = 'ltw_bongda_matches';

export const loadSaved = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const saveMatches = (matches) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(matches));
  } catch {
    
  }
};