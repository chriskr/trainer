'use strict';

import Digits from './digits.js';

export type Callback = {
  at?: number;
  callback: () => void;
};

export type TimerConfig = {
  isUpdateDisplay?: boolean;
  duration: number;
  callbacks: Callback[];
};

export class Timer {
  private digitsMinutes: Digits;
  private digitsSeconds: Digits;
  private startTime: number = 0;
  private countDownInterval: number = 0;
  private minutesValue: string = '00';
  private secondsValue: string = '00';
  private timerConfig: TimerConfig | null = null;

  constructor(digitsMinutes: SVGGElement, digitsSeconds: SVGGElement) {
    this.showTime = this.showTime.bind(this);
    this.digitsMinutes = new Digits(digitsMinutes);
    this.digitsSeconds = new Digits(digitsSeconds);
    this.updateDigits();
  }

  setConfig({ duration, callbacks, isUpdateDisplay = true }: TimerConfig) {
    this.timerConfig = {
      isUpdateDisplay,
      duration,
      callbacks: callbacks.slice(0),
    };
  }

  start() {
    this.startTime = Date.now();
    this.countDownInterval = setInterval(this.showTime, 100);
    this.showTime();
  }

  pause() {
    if (!(this.timerConfig && this.countDownInterval)) {
      return;
    }

    const passed = Date.now() - this.startTime;

    this.timerConfig.duration -= passed;
    this.timerConfig.callbacks.forEach((callbackConfig) => {
      if (callbackConfig.at) {
        callbackConfig.at -= passed;
      }
    });
    clearInterval(this.countDownInterval);
  }

  resume() {
    this.start();
  }

  reset() {
    clearInterval(this.countDownInterval);
    debugger;
    this.timerConfig = null;
  }

  private showTime() {
    if (!this.timerConfig) {
      clearInterval(this.countDownInterval);
      return;
    }
    const time = Date.now();
    const timePassed = time - this.startTime;
    let remainingTime = this.timerConfig.duration - timePassed;

    this.timerConfig.callbacks = this.timerConfig.callbacks.filter(
      ({ at, callback }) => {
        if (typeof at === 'number' && timePassed >= at) {
          callback();
          return false;
        }
        return true;
      }
    );

    const { isUpdateDisplay } = this.timerConfig;

    if (remainingTime <= 0) {
      remainingTime = 0;

      clearInterval(this.countDownInterval);
      const { callbacks } = this.timerConfig;
      this.timerConfig = null;
      callbacks.forEach(({ callback }) => {
        callback();
      });
    }

    if (isUpdateDisplay) {
      const secondsTotal = Math.round(remainingTime / 1000);
      const seconds = secondsTotal % 60;
      const minutes = (secondsTotal - seconds) / 60;
      this.minutesValue = this.format_(minutes);
      this.secondsValue = this.format_(seconds);
      this.updateDigits();
    }
  }

  updateDigits() {
    this.digitsMinutes.display(Number.parseInt(this.minutesValue));
    this.digitsSeconds.display(Number.parseInt(this.secondsValue));
  }

  format_(number: number) {
    number = Math.min(Math.max(number, 0), 60);
    return (number < 10 ? '0' : '') + String(number);
  }
}

export default Timer;
