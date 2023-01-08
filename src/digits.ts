const digits = [
  0b0111111, 0b0000110, 0b1011011, 0b1001111, 0b1100110, 0b1101101, 0b1111101,
  0b0000111, 0b1111111, 0b1101111,
];

class Digits {
  eles_: SVGPathElement[][];
  constructor(svg: SVGGElement) {
    this.eles_ = ['.d-1 .digit-line', '.d-10 .digit-line'].map((selector) =>
      Array.from(svg.querySelectorAll(selector))
    );
  }

  display(n: number) {
    for (let j = 0; j < 2; j++) {
      let s = digits[n % 10];
      for (let i = 0; i < 7; i++) {
        this.eles_[j][i].classList.toggle('on', (s & 1) === 1);
        s >>= 1;
      }
      n = (n / 10) | 0;
    }
  }
}

export default Digits;
