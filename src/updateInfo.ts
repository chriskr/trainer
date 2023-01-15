import { render, Template } from './uldu';

export const updateInfo = (template: Template) => {
  const infoContainer = document.querySelector('#info-container');
  if (infoContainer) {
    infoContainer.textContent = '';
    render(template, infoContainer);
  }
};
