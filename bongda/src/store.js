import { configureStore } from '@reduxjs/toolkit';
import matchesReducer from './features/matchesSlice';
import goalReducer from './features/goalSlice';
import { loadSaved, saveMatches } from './storage';

const saved = loadSaved();
export const hasSaved = saved !== null;

export const store = configureStore({
  reducer: {
    matches: matchesReducer,
    goal: goalReducer,
  },
  preloadedState: { matches: saved ?? [] },
});

let prevMatches = store.getState().matches;
store.subscribe(() => {
  const current = store.getState().matches;
  if (current !== prevMatches) {
    prevMatches = current;
    saveMatches(current);
  }
});