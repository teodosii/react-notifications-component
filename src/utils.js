export function cssWidth(width) {
  return width ? `${width}px` : undefined;
}

export function isNullOrUndefined(prop) {
  return prop === null || prop === undefined;
}

export function isString(object) {
  return typeof object === "string";
}

export function isNumber(object) {
  return typeof object === "number";
}

export function isBoolean(object) {
  return typeof object === "boolean";
}

export function isArray(object) {
  return !isNullOrUndefined(object) && object.constructor === Array;
}
