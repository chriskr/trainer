import { render, Template } from './uldu';

export const updateInfo = (template?: Template) => {
  const infoContainer = document.querySelector('#info-container');
  if (infoContainer) {
    infoContainer.textContent = '';
    if (template) {
      render(template, infoContainer);
      document.body.classList.add('active');
    } else {
      document.body.classList.remove('active');
      render(['span', '\u00a0'], infoContainer);
    }
  }
};
