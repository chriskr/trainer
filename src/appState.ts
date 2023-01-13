export type AppState = 'default' | 'running' | 'pausing';

let appState = 'default';

export const getAppState = () => appState;

export const setAppState = (state: AppState) => (appState = state);
