import { createColor } from 'color-interfaces';

const MINIMAL_CONTRAST_RATIO = 3;

const limitLuminance = (color: string) => {
  const c = createColor(color);
  const white = createColor('white');
  while (c.getContrastRatio(white) < MINIMAL_CONTRAST_RATIO) {
    c.hsl.l -= 0.01;
  }
  return c.hsl.toCss();
};

export const setLinearGradient = (
  cooldownColor: string,
  intenseColor: string
) => {
  const angle =
    (Math.atan(window.innerHeight / window.innerWidth) / (2 * Math.PI)) * 360;
  document.body.style.setProperty(
    'background-image',
    `linear-gradient(${Math.round(angle)}deg, ${limitLuminance(
      intenseColor
    )}, ${limitLuminance(cooldownColor)})`
  );
};
