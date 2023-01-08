let context = null;
let gainNode = null;
let oscillator = null;
const getPrimites = () => {
    if (!context) {
        context = new AudioContext();
    }
    if (!gainNode) {
        gainNode = context.createGain();
        gainNode.connect(context.destination);
    }
    if (!oscillator) {
        oscillator = context.createOscillator();
        oscillator.connect(gainNode);
        oscillator.start(0);
    }
    return { context, gainNode, oscillator };
};
const playSound = ([frequency, type, ramps]) => {
    const { gainNode, context, oscillator } = getPrimites();
    gainNode.gain.cancelScheduledValues(context.currentTime);
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0, context.currentTime);
    let time = 0;
    for (const [duration, level] of ramps) {
        setTimeout(() => gainNode.gain.linearRampToValueAtTime(level, context.currentTime + duration), time);
        time += duration * 1000;
    }
};

/*
    Copyright 2017 Christian Krebs
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
        http://www.apache.org/licenses/LICENSE-2.0
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
const TEXT_NODE_NAME = '#text';
const NAMESPACES = {
    svg: 'http://www.w3.org/2000/svg',
};
const OBJECT_TYPE_NAME = '[object Object]';
const STRING_TYPE_NAME = 'string';
const toString = Function.prototype.call.bind(Object.prototype.toString);
const isDictionary = (obj) => toString(obj) === OBJECT_TYPE_NAME;
const isString = (str) => typeof str === STRING_TYPE_NAME;
const isNumber = (number) => typeof number === 'number';
const isTextNodeName = (str) => str === TEXT_NODE_NAME;
const isListener = (fun) => typeof fun === 'function';
const isElement = (ele) => ele instanceof Element;
const EVENT_NAMES = new Set(['onClick', 'onInput']);
const listenerMap = new WeakMap();
const registeredListeners = new Set();
const callback = (event) => {
    let ele = event.target;
    if (!isElement(ele))
        return;
    while (ele) {
        const listener = listenerMap.get(ele);
        if (listener)
            listener(ele, event);
        ele = ele.parentElement;
    }
};
const registerListener = (name, listener, element) => {
    if (!EVENT_NAMES.has(name))
        return;
    const eventName = name.slice(2).toLowerCase();
    if (!registeredListeners.has(eventName)) {
        document.addEventListener(eventName, callback);
        registeredListeners.add(eventName);
    }
    listenerMap.set(element, listener);
};
const createDom = (tmpl, namespace = '') => {
    const ELE_NAME = 0;
    const ATTRS = 1;
    const elementName = tmpl[ELE_NAME];
    let ele = null;
    let i = 0;
    if (isString(elementName) && !isTextNodeName(elementName)) {
        i++;
        if (elementName.includes(':')) {
            const pos = elementName.indexOf(':');
            namespace = NAMESPACES[elementName.slice(0, pos)];
            ele = document.createElementNS(namespace, elementName.slice(pos + 1));
        }
        else {
            ele = document.createElement(elementName);
        }
        const attrs = tmpl[ATTRS];
        if (isDictionary(attrs)) {
            i++;
            for (const prop in attrs) {
                const value = attrs[prop];
                if (isString(value)) {
                    ele.setAttribute(prop, value);
                }
                else if (isNumber(value)) {
                    ele.setAttribute(prop, String(value));
                }
                else if (isListener(value)) {
                    registerListener(prop, value, ele);
                }
            }
        }
    }
    else {
        if (isTextNodeName(elementName)) {
            i++;
        }
        ele = document.createDocumentFragment();
    }
    for (; i < tmpl.length; i++) {
        const item = tmpl[i];
        if (isString(item)) {
            ele.appendChild(document.createTextNode(item));
        }
        else if (item) {
            if (isDictionary(item)) {
                throw Error('Wrong template format');
            }
            ele.appendChild(createDom(item, namespace));
        }
    }
    return ele;
};
const render = (templ, ele) => ele.appendChild(createDom(templ));

const digits = [
    0b0111111, 0b0000110, 0b1011011, 0b1001111, 0b1100110, 0b1101101, 0b1111101,
    0b0000111, 0b1111111, 0b1101111,
];
class Digits {
    eles_;
    constructor(svg) {
        this.eles_ = ['.d-1 .digit-line', '.d-10 .digit-line'].map((selector) => Array.from(svg.querySelectorAll(selector)));
    }
    display(n) {
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

class Timer {
    callback = null;
    digitsMinutes;
    digitsSeconds;
    duration = 0;
    startTime = 0;
    countDownInterval = 0;
    minutesValue = '00';
    secondsValue = '00';
    callbackTime = 0;
    constructor(digitsMinutes, digitsSeconds) {
        this.showTime = this.showTime.bind(this);
        this.digitsMinutes = new Digits(digitsMinutes);
        this.digitsSeconds = new Digits(digitsSeconds);
        this.updateDigits();
    }
    setDuration(duration) {
        this.duration = duration;
    }
    start(callback = () => console.log('callback'), callbackTime = 0) {
        this.callback = callback;
        this.callbackTime = callbackTime;
        this.startTime = Date.now() + this.duration;
        this.countDownInterval = setInterval(this.showTime, 100);
        this.showTime();
    }
    stop() { }
    showTime() {
        let remainingTime = this.startTime - Date.now();
        if (remainingTime <= this.callbackTime) {
            if (this.callback) {
                this.callback();
                this.callback = null;
            }
        }
        if (remainingTime <= 0) {
            remainingTime = 0;
            clearInterval(this.countDownInterval);
        }
        let secondsTotal = Math.round(remainingTime / 1000);
        let seconds = secondsTotal % 60;
        let minutes = (secondsTotal - seconds) / 60;
        this.minutesValue = this.format_(minutes);
        this.secondsValue = this.format_(seconds);
        this.updateDigits();
    }
    updateDigits() {
        this.digitsMinutes.display(Number.parseInt(this.minutesValue));
        this.digitsSeconds.display(Number.parseInt(this.secondsValue));
    }
    format_(number) {
        number = Math.min(Math.max(number, 0), 60);
        return (number < 10 ? '0' : '') + String(number);
    }
}

const sound1 = [
    600,
    'sinus',
    [
        [0.1, 1],
        [0.2, 0.7],
        [0.4, 0.7],
        [0.1, 0.000001],
    ],
];
const sound2 = [
    1000,
    'sinus',
    [
        [0.1, 1],
        [0.2, 0.7],
        [0.4, 0.7],
        [0.1, 0.000001],
    ],
];
const playStartSound = () => {
    playSound(sound1);
    setTimeout(() => playSound(sound1), 1000);
    setTimeout(() => playSound(sound1), 2000);
    setTimeout(() => playSound(sound2), 3000);
};
const play = async (repetions, intense, cooldown, timer) => {
    let isFist = true;
    while (repetions > 0) {
        if (isFist) {
            playStartSound();
            isFist = false;
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        timer.setDuration(intense * 1000);
        timer.start(playStartSound, 3000);
        await new Promise((resolve) => setTimeout(resolve, (intense + 1) * 1000));
        timer.setDuration(cooldown * 1000);
        timer.start(playStartSound, 3000);
        await new Promise((resolve) => setTimeout(resolve, (cooldown + 1) * 1000));
        repetions -= 1;
        document.querySelector('#repetitions').value =
            String(repetions);
    }
};
window.onload = () => {
    const templ = [
        'div',
        [
            'button',
            {
                id: 'start',
                onClick: () => {
                    const [repetitions, intense, cooldown] = [
                        '#repetitions',
                        '#intense',
                        '#cooldown',
                    ].map((selector) => Number.parseInt(document.querySelector(selector).value, 10));
                    play(repetitions, intense, cooldown, timer);
                    //timer.setDuration(5000);
                    //timer.start(() => console.log('>>>>>>>>>>>>>>>>>'));
                },
            },
            'start',
        ],
        [
            'div',
            { id: 'controls' },
            [
                'label',
                'repetitions:',
                [
                    'input',
                    {
                        type: 'number',
                        id: 'repetitions',
                        value: 5,
                    },
                ],
            ],
            [
                'label',
                'intense:',
                [
                    'input',
                    {
                        type: 'number',
                        id: 'intense',
                        value: 60,
                    },
                ],
            ],
            [
                'label',
                'cool down:',
                [
                    'input',
                    {
                        type: 'number',
                        id: 'cooldown',
                        value: 120,
                    },
                ],
            ],
        ],
    ];
    render(templ, document.body);
    const timer = new Timer(...['#digits-minutes', '#digits-seconds'].map((selector) => document.querySelector(selector)));
};
