export function isNull(prop) {
  return prop === null || prop === undefined;
}

export function isString(object) {
  return typeof object === 'string';
}

export function isNumber(object) {
  return typeof object === 'number';
}

export function isBoolean(object) {
  return typeof object === 'boolean';
}

export function isArray(object) {
  return !isNull(object) && object.constructor === Array;
}

export function getRandomId() {
  return Math.random().toString(36).substr(2, 9);
}
