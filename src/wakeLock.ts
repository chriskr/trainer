// Keeps the screen on while a training is in progress.
// The browser drops the lock whenever the page is hidden,
// so it is requested again when the page becomes visible.

let sentinel: WakeLockSentinel | null = null;
let isWanted = false;

const request = async () => {
  if (!('wakeLock' in navigator) || sentinel) return;
  try {
    sentinel = await navigator.wakeLock.request('screen');
    sentinel.addEventListener('release', () => (sentinel = null));
  } catch (e) {
    // Not allowed right now (e.g. low battery); the timer still works.
  }
};

export const keepScreenOn = () => {
  isWanted = true;
  request();
};

export const allowScreenOff = () => {
  isWanted = false;
  sentinel?.release();
  sentinel = null;
};

document.addEventListener('visibilitychange', () => {
  if (isWanted && document.visibilityState === 'visible') {
    request();
  }
});
