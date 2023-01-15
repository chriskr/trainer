export type AppState = 'default' | 'running' | 'pausing' | 'resume' | 'blank';

let appState = 'default';

export const getAppState = () => appState;

export const setAppState = (state: AppState) => (appState = state);
