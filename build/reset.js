const reset = (timer, isTouchDevice) => {
  timer.reset();
  updateControls('default', timer, isTouchDevice);
  updateInfo([]);
  document.body.classList.remove('hot');
};
