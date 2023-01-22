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

export type Listener = (element: Element, event: Event) => null;

type ATTRIBUTES = Record<string, string | number | object | Listener>;
type TEXT_NODE_NAME = '#text';
export type Template = (string | Template | ATTRIBUTES)[];

const TEXT_NODE_NAME = '#text';
export const NAMESPACES: Record<string, string> = {
  svg: 'http://www.w3.org/2000/svg',
};
const OBJECT_TYPE_NAME = '[object Object]';
const STRING_TYPE_NAME = 'string';
const toString = Function.prototype.call.bind(Object.prototype.toString);
const isDictionary = (obj: unknown): obj is ATTRIBUTES =>
  toString(obj) === OBJECT_TYPE_NAME;
const isString = (str: unknown): str is string =>
  typeof str === STRING_TYPE_NAME;
const isNumber = (number: unknown): number is number =>
  typeof number === 'number';
const isTextNodeName = (str: unknown): str is TEXT_NODE_NAME =>
  str === TEXT_NODE_NAME;
const isListener = (fun: unknown): fun is Listener => typeof fun === 'function';
const isElement = (ele: unknown): ele is Element => ele instanceof Element;

const EVENT_NAMES = new Map([
  ['onClick', 'click'],
  ['onInput', 'input'],
]);

const listenerMap = new Map<string, WeakMap<Element, Listener>>();
const registeredListeners = new Set<string>();

const callback = (event: Event) => {
  const listenerTypeMap = listenerMap.get(event.type);
  let ele: Element | null = event.target as Element;
  if (!(listenerTypeMap && isElement(ele))) return;
  while (ele) {
    const listener = listenerTypeMap.get(ele);
    if (listener) listener(ele, event);
    ele = ele.parentElement;
  }
};

const registerListener = (
  name: string,
  listener: Listener,
  element: Element
) => {
  const eventTypeName = EVENT_NAMES.get(name);
  if (!eventTypeName) return;
  if (!registeredListeners.has(eventTypeName)) {
    listenerMap.set(eventTypeName, new WeakMap<Element, Listener>());
    document.addEventListener(eventTypeName, callback);
    registeredListeners.add(eventTypeName);
  }
  listenerMap.get(eventTypeName)!.set(element, listener);
};

export const createDom = (tmpl: Template, namespace = '') => {
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
    } else {
      ele = document.createElement(elementName);
    }
    const attrs = tmpl[ATTRS];
    if (isDictionary(attrs)) {
      i++;
      for (const prop in attrs) {
        const value = attrs[prop];
        if (isString(value)) {
          ele.setAttribute(prop, value);
        } else if (isNumber(value)) {
          ele.setAttribute(prop, String(value));
        } else if (isListener(value)) {
          registerListener(prop, value, ele);
        }
      }
    }
  } else {
    if (isTextNodeName(elementName)) {
      i++;
    }
    ele = document.createDocumentFragment();
  }
  for (; i < tmpl.length; i++) {
    const item = tmpl[i];
    if (isString(item)) {
      ele.appendChild(document.createTextNode(item));
    } else if (item) {
      if (isDictionary(item)) {
        throw Error('Wrong template format');
      }
      ele.appendChild(createDom(item, namespace));
    }
  }
  return ele;
};

export const render = (templ: Template, ele: Element) =>
  ele.appendChild(createDom(templ));
export const renderClean = (templ: Template, ele: Element) => {
  ele.textContent = '';
  return render(templ, ele);
};
