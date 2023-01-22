const reset = (timer, isTouchDevice) => {
  timer.reset();
  updateControls('default', timer, isTouchDevice);
  updateInfo([['span'], ['span', 'personal trainer'], ['span']]);
  document.body.classList.remove('hot');
};
