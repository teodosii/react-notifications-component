function createClientXY(x, y) {
  return {
    pageX: x,
    pageY: y
  };
}

export function createTouchObject({ x = 0, y = 0 }) {
  return {
    touches: [createClientXY(x, y)]
  };
}