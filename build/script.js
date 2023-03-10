const digits = [
    0b0111111, 0b0000110, 0b1011011, 0b1001111, 0b1100110, 0b1101101, 0b1111101,
    0b0000111, 0b1111111, 0b1101111,
];
const noNumber = 0b1000000;
class Digits {
    eles_;
    constructor(svg) {
        this.eles_ = ['.d-1 .digit-line', '.d-10 .digit-line'].map((selector) => Array.from(svg.querySelectorAll(selector)));
    }
    reset() {
        for (let j = 0; j < 2; j++) {
            let s = noNumber;
            for (let i = 0; i < 7; i++) {
                this.eles_[j][i].classList.toggle('on', (s & 1) === 1);
                s >>= 1;
            }
        }
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
    digitsMinutes;
    digitsSeconds;
    startTime = 0;
    countDownInterval = 0;
    minutesValue = '00';
    secondsValue = '00';
    timerConfig = null;
    constructor(digitsMinutes, digitsSeconds) {
        this.showTime = this.showTime.bind(this);
        this.digitsMinutes = new Digits(digitsMinutes);
        this.digitsSeconds = new Digits(digitsSeconds);
        this.reset();
    }
    setConfig({ duration, callbacks, isUpdateDisplay = true }) {
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
        this.timerConfig = null;
        this.digitsMinutes.reset();
        this.digitsSeconds.reset();
    }
    showTime() {
        if (!this.timerConfig) {
            clearInterval(this.countDownInterval);
            return;
        }
        const time = Date.now();
        const timePassed = time - this.startTime;
        let remainingTime = this.timerConfig.duration - timePassed;
        this.timerConfig.callbacks = this.timerConfig.callbacks.filter(({ at, callback }) => {
            if (typeof at === 'number' && timePassed >= at) {
                callback();
                return false;
            }
            return true;
        });
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
    format_(number) {
        number = Math.min(Math.max(number, 0), 60);
        return (number < 10 ? '0' : '') + String(number);
    }
}

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
const EVENT_NAMES = new Map([
    ['onClick', 'click'],
    ['onInput', 'input'],
]);
const listenerMap = new Map();
const registeredListeners = new Set();
const callback = (event) => {
    const listenerTypeMap = listenerMap.get(event.type);
    let ele = event.target;
    if (!(listenerTypeMap && isElement(ele)))
        return;
    while (ele && !event.defaultPrevented) {
        const listener = listenerTypeMap.get(ele);
        if (listener)
            listener(ele, event);
        ele = ele.parentElement;
    }
};
const registerListener = (name, listener, element) => {
    const eventTypeName = EVENT_NAMES.get(name);
    if (!eventTypeName)
        return;
    if (!registeredListeners.has(eventTypeName)) {
        listenerMap.set(eventTypeName, new WeakMap());
        document.addEventListener(eventTypeName, callback);
        registeredListeners.add(eventTypeName);
    }
    listenerMap.get(eventTypeName).set(element, listener);
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

const registerTooltip = () => {
    document.addEventListener('mouseover', tooltipHandler, { capture: true });
};
const TOOLTIP_KEY = 'data-tooltip-text';
let previousTarget = null;
let tooltipContainer = null;
const tooltipHandler = (event) => {
    let target = event.target;
    while (target instanceof HTMLElement) {
        const tooltipText = target.dataset.tooltipText;
        if (tooltipText) {
            if (target === previousTarget)
                return;
            previousTarget = target;
            displayTooltip(tooltipText, target);
            return;
        }
        target = target.parentElement;
    }
    clearTooltip();
    previousTarget = null;
};
const displayTooltip = (text, target) => {
    if (!tooltipContainer) {
        tooltipContainer = render(['div', { id: 'tooltip-container' }], document.body);
    }
    clearTooltip();
    const rect = target.getBoundingClientRect();
    const tooltip = render(['div', { id: 'tooltip', style: 'left: -10000px; top: 0' }, text], tooltipContainer);
    const tooltipRect = tooltip.getBoundingClientRect();
    tooltip.style.cssText = ` left: ${rect.left + rect.width / 2 - tooltipRect.width / 2}px; top: ${rect.top - tooltipRect.height - 10}px`;
};
const clearTooltip = () => {
    if (tooltipContainer && previousTarget) {
        tooltipContainer.textContent = '';
    }
};

const getButton = ({ isTouchDevice, onClick, iconName, label, }) => {
    return isTouchDevice
        ? [
            'span',
            {
                class: 'touch-device',
                ...(onClick ? { onClick } : {}),
            },
            ['span', { class: 'material-icons main-controls' }, iconName],
            ['span', { class: 'label' }, label],
        ]
        : [
            'span',
            {
                class: 'material-icons main-controls',
                [TOOLTIP_KEY]: label,
                ...(onClick ? { onClick } : {}),
            },
            iconName,
        ];
};

let savedTrainingConfig = {
    repetitions: 5,
    intervalHigh: 60,
    intervalLow: 120,
};
const storageKey = 'trainingConfig';
const loadTraingConfig = () => {
    const config = window.localStorage.getItem(storageKey);
    if (config) {
        setTrainingConfig(JSON.parse(config));
    }
};
const setTrainingConfig = (trainingConfig) => {
    savedTrainingConfig = trainingConfig;
    window.localStorage.setItem(storageKey, JSON.stringify(savedTrainingConfig));
};
const getSavedTrainingsConfig = () => savedTrainingConfig;
const saveConfig = () => {
    const [repetitions, intervalHigh, intervalLow] = [
        '#repetitions',
        '#intervalHigh',
        '#intervalLow',
    ].map((selector) => Number.parseInt(document.querySelector(selector).value, 10));
    setTrainingConfig({ repetitions, intervalHigh, intervalLow });
    closeConfig();
};
const closeConfig = () => document.querySelector('#modal')?.remove();
const showConfig = (isTouchDevice) => {
    const { repetitions, intervalHigh, intervalLow } = getSavedTrainingsConfig();
    const templ = [
        'div',
        { id: 'modal' },
        [
            'div',
            { id: 'settings' },
            [
                'div',
                { id: 'configs' },
                [
                    'label',
                    'repetitions:',
                    [
                        'input',
                        {
                            type: 'number',
                            id: 'repetitions',
                            value: repetitions,
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
                            id: 'intervalHigh',
                            value: intervalHigh,
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
                            id: 'intervalLow',
                            value: intervalLow,
                        },
                    ],
                ],
            ],
            [
                'footer',
                { class: 'controls' },
                getButton({
                    isTouchDevice,
                    onClick: closeConfig,
                    iconName: 'close',
                    label: 'close',
                }),
                getButton({
                    isTouchDevice,
                    onClick: saveConfig,
                    iconName: 'save_alt',
                    label: 'save',
                }),
            ],
        ],
    ];
    render(templ, document.body);
};

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

const updateInfo = (template) => {
    const infoContainer = document.querySelector('#info-container');
    if (infoContainer) {
        infoContainer.textContent = '';
        if (template) {
            render(template, infoContainer);
            document.body.classList.add('active');
        }
        else {
            document.body.classList.remove('active');
        }
    }
};

const play = (repetitions, intervalHigh, intervalLow, timer, isTouchDevice, updateControls, reset) => {
    const startAfter = 5000;
    let counter = 1;
    const update = (interval) => updateInfo([
        ['span', interval],
        ['span', `round ${counter} of ${repetitions}`],
    ]);
    const intervals = [
        {
            duration: startAfter,
            isUpdateDisplay: false,
            callbacks: [
                { at: startAfter - 3000, callback: playStartSound },
                {
                    callback: () => {
                        clearTooltip();
                        updateControls('running', timer, isTouchDevice);
                        nextTick();
                    },
                },
            ],
        },
    ];
    const nextTick = () => {
        const config = intervals.shift();
        if (config) {
            timer.setConfig(config);
            timer.start();
        }
    };
    for (let i = 0; i < repetitions; i++) {
        intervals.push({
            duration: intervalHigh * 1000,
            callbacks: [
                {
                    at: 0,
                    callback: () => {
                        document.body.classList.add('hot');
                        update('go intense');
                    },
                },
                { at: intervalHigh * 1000 - 3000, callback: playStartSound },
                { callback: () => setTimeout(nextTick, 1000) },
            ],
        }, {
            duration: intervalLow * 1000,
            callbacks: [
                {
                    at: 0,
                    callback: () => {
                        document.body.classList.remove('hot');
                        update('cool down');
                    },
                },
                { at: intervalLow * 1000 - 3000, callback: playStartSound },
                {
                    callback: () => {
                        setTimeout(() => {
                            counter++;
                            nextTick();
                        }, 1000);
                    },
                },
                ...(i === repetitions - 1
                    ? [
                        {
                            callback: () => {
                                clearTooltip();
                                reset(timer, isTouchDevice, updateControls);
                            },
                        },
                    ]
                    : []),
            ],
        });
    }
    clearTooltip();
    updateControls('blank', timer, isTouchDevice);
    nextTick();
};

const reset = (timer, isTouchDevice, updateControls) => {
    updateControls('default', timer, isTouchDevice);
    updateInfo();
    document.body.classList.remove('hot');
    setTimeout(() => timer.reset(), 500);
};

const updateControls = (state, timer, isTouchDevice) => {
    const controls = document.querySelector('#controls-container');
    if (controls) {
        controls.textContent = '';
        render(getControls(state, timer, isTouchDevice), controls);
    }
};
const pause = (timer, isTouchDevice) => {
    timer.pause();
    updateControls('resume', timer, isTouchDevice);
};
const resume = (timer, isTouchDevice) => {
    timer.resume();
    updateControls('running', timer, isTouchDevice);
};
const getControls = (state, timer, isTouchDevice) => {
    switch (state) {
        case 'default':
            return [
                'div',
                { class: 'controls' },
                getButton({
                    isTouchDevice,
                    onClick: () => {
                        const { repetitions, intervalHigh, intervalLow } = getSavedTrainingsConfig();
                        play(repetitions, intervalHigh, intervalLow, timer, isTouchDevice, updateControls, reset);
                    },
                    iconName: 'play_circle_filled',
                    label: 'start',
                }),
                getButton({
                    isTouchDevice,
                    onClick: () => showConfig(isTouchDevice),
                    iconName: 'settings',
                    label: 'settings',
                }),
            ];
        case 'blank':
            return [
                'div',
                { class: 'controls' },
                ['span'],
                getButton({
                    isTouchDevice,
                    iconName: 'hourglass_empty',
                    label: 'get ready',
                }),
                ['span'],
            ];
        case 'running':
            return [
                'div',
                { class: 'controls' },
                ['span'],
                getButton({
                    isTouchDevice,
                    onClick: () => pause(timer, isTouchDevice),
                    iconName: 'pause',
                    label: 'pause',
                }),
                ['span'],
            ];
        case 'resume':
            return [
                'div',
                { class: 'controls' },
                getButton({
                    isTouchDevice,
                    onClick: () => resume(timer, isTouchDevice),
                    iconName: 'play_circle_filled',
                    label: 'resume',
                }),
                getButton({
                    isTouchDevice,
                    onClick: () => reset(timer, isTouchDevice, updateControls),
                    iconName: 'restart_alt',
                    label: 'restart',
                }),
            ];
        default:
            return [];
    }
};

const debounce = (fn, debounceTime) => {
    let timeout = 0;
    const wrappedFn = () => {
        clearTimeout(timeout);
        timeout = 0;
        fn();
    };
    return () => {
        if (timeout === 0) {
            timeout = setTimeout(wrappedFn, debounceTime);
        }
    };
};
const setLinearGradient = () => {
    const angle = (Math.atan(window.innerHeight / window.innerWidth) / (2 * Math.PI)) * 360;
    document.body.style.setProperty('background-image', `linear-gradient(${Math.round(angle)}deg, #f00, #00f)`);
};
window.onload = () => {
    try {
        loadTraingConfig();
    }
    catch (e) { }
    const timer = new Timer(...['#digits-minutes', '#digits-seconds'].map((selector) => document.querySelector(selector)));
    const isTouchDevice = 'ontouchstart' in document.documentElement;
    updateControls('default', timer, isTouchDevice);
    updateInfo();
    if (isTouchDevice) {
        document.querySelector('.repolink')?.remove();
        document.body.classList.add('is-touch-device');
    }
    else {
        registerTooltip();
    }
    document.body.style.fontSize = `${16 / window.devicePixelRatio}px`;
    setLinearGradient();
    window.addEventListener('resize', debounce(setLinearGradient, 100));
};
